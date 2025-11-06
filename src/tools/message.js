/**
 * @file tools/message.js
 * @description Suriform utility for handling message transformation.
 *
 * Provides flexible message processing layers for validation results, allowing
 * developers to extend or normalize messages before display. Supports grouped rule
 * aggregation, and custom wrapping logic for localization or formatting needs.
 */

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Initializes message extension utilities for a Suriform form.
 *
 * Attaches an internal `__sfMessage` controller to the form that
 * supports chained message transformations across multiple levels.
 * Enables customization of validation messages without altering
 * core validation logic or existing form markup.
 *
 * @param {HTMLFormElement} form - The form to extend message handling for.
 * @returns {Object} Control interface with `multiMessage`, `groupMessage`, and `wrapMessage` methods.
 * @throws {Error} If `form` is not a valid <form> element.
 */
export function extendMessage(form) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[SF] extendMessage() requires a valid form element.')
  }

  // Storage for all message transformation handlers
  form.__sfMessage = {
    group: null,
    wrap: null
  }

  /* ------------------------------------------------------------------------ */
  /* Grouped Rule Message Aggregation                                         */
  /* ------------------------------------------------------------------------ */

  /**
   * Define a message aggregator for grouped validation rules.
   *
   * Allows multiple related rules to share a single, unified message.
   * When any rule in the defined group fails, the group name and message
   * are used instead of individual rule labels.
   *
   * @param {Object} object - Group configuration.
   * @param {string[]} [object.rules=[]] - Array of rule names to group.
   * @param {string} [object.message=''] - Shared message for the group.
   * @returns {void}
   */
  function groupMessage(object) {
    const { rules = [], message = '' } = object

    // Attach the group hook to the form
    form.__sfMessage.group = function ({ field, attr }) {
      const params = []

      const hasAttribute = rules.every((rule) => {
        params.push(field.getAttribute(rule))
        return field.hasAttribute(rule)
      })

      const isIncluded = rules.includes(attr)

      // Return the group context
      if (hasAttribute && isIncluded) {
        return { message, params, format: rules }
      }

      return false
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Custom Message Wrapping Layer                                            */
  /* ------------------------------------------------------------------------ */

  /**
   * Define a wrapper callback to post-process messages before rendering.
   *
   * Provides a final transformation stage for localization, formatting,
   * or custom rendering logic. The callback may safely return a modified
   * message; if it returns `undefined`, the original message is preserved.
   *
   * Any exceptions thrown in the callback are caught and logged to avoid
   * disrupting validation flow.
   *
   * @param {({message: string; field: HTMLElement}) => (string|undefined)} callback - A function that receives the current message and form field.
   * @returns {void}
   */
  function wrapMessage(callback) {
    // Attach the wrap hook to the form
    form.__sfMessage.wrap = function ({ field, message }) {
      try {
        const result = callback({ field, message })
        if (result !== undefined) return result
      } catch (err) {
        console.error(`[SF] Error in wrapMessage() callback:`, err)
      }
    }
  }

  return { groupMessage, wrapMessage }
}
