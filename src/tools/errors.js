/**
 * @file tools/error.js
 * @description Suriform utility for handling stateful validation error.
 *
 * Provides reactive tracking for inline validation errors in a form. Exposes an
 * event-driven API to observe additions, removals, and overall error state changes.
 * Designed to integrate seamlessly with visual tools such as summaries or popups.
 */

import { withSummary as useSummary } from './summary'
import { withPopup as usePopup } from './popup'
import { useValidity } from './hooks'

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Initializes reactive validation error handling for a Suriform form.
 *
 * Watches a form’s validity lifecycle using the `useValidity` hook.
 * Tracks all invalid fields in a WeakMap and exposes callbacks for
 * when errors are added, removed, or when the entire error list changes.
 *
 * @param {HTMLFormElement} form - The form element to observe.
 * @param {Object} [options] - Optional configuration for focus/scroll behavior.
 * @param {boolean} [options.withPopup=false] - Initializes the popup feedback when `true`.
 * @param {boolean} [options.withSummary=false] - Initializes the summary feedback when `true`.
 * @returns {Object} The error tracking API with event hooks and query helpers.
 * @throws {Error} If `form` is not a valid <form> element.
 */
export function handleErrors(form, options = {}) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[SF] handleErrors() requires a valid form element.')
  }

  // Merge user options with defaults
  const config = {
    withPopup: false,
    withSummary: false,
    ...options
  }

  // Stores all active errors
  let errors = new WeakMap()

  // Initialize the internal validity watcher
  const validity = useValidity(form)

  // Default no-op callbacks to be replaced
  let onAddCallback = () => {}
  let onChangeCallback = () => {}
  let onRemoveCallback = () => {}
  let onCollectCallback = () => {}
  let onEmptyCallback = () => {}

  // Setup error feedbacks
  let summary, popup
  setupFeedbacks()

  /**
   * Handle new invalid field event.
   *
   * Adds the error message to the internal map, triggers
   * all registered callbacks, and optionally focuses or
   * scrolls to the first invalid field for accessibility.
   *
   * @param {HTMLElement} [field] - The invalid field element.
   * @param {string} [message] - The validation error message.
   */
  validity.onInvalid(({ field, message }) => {
    if (errors.get(field)) {
      onChangeCallback({ field, message })
    } else {
      onAddCallback({ field, message })
    }

    errors.set(field, message)

    if (summary) summary.addError(field, message)
    if (popup) popup.addError(field, message)
  })

  /**
   * Handle new valid field event.
   *
   * Removes any associated error entry and notifies
   * listeners through the remove and change callbacks.
   *
   * @param {HTMLElement} [field] - The field element that became valid.
   */
  validity.onValid(({ field }) => {
    const message = errors.get(field)
    if (!message) return

    errors.delete(field)
    onRemoveCallback({ field, message })

    if (summary) summary.removeError(field)
    if (popup) popup.removeError(field)
  })

  /**
   * Handle form validation failure event.
   *
   * Triggered when the form is explicitly validated and has invalid fields.
   * Clears and repopulates the internal error map based on the provided validation
   * results, ensuring synchronization between the form state and tracked errors.
   *
   * @param {Object} formErrors - List of invalid fields and their messages.
   */
  validity.onFail((formErrors) => {
    errors = new WeakMap()

    for (let i = 0; i < formErrors.length; i++) {
      const { field, message } = formErrors[i]
      errors.set(field, message)
    }

    onCollectCallback(getErrors())
    if (summary) summary.addErrors(formErrors)
    if (popup) popup.addErrors(formErrors)
  })

  /**
   * Handle form validation success event.
   *
   * Triggered when the form the passes with no invalid fields
   * Clears all internal error map and all the active error feedbacks.
   */
  validity.onPass(() => {
    errors = new WeakMap()

    onEmptyCallback()
    if (summary) summary.removeErrors()
    if (popup) popup.removeErrors()
  })

  /**
   * Handle form validation reset event.
   *
   * Triggered when the form the passes with no invalid fields
   * Clears all internal error map and all the active error feedbacks.
   */
  validity.onReset(() => {
    errors = new WeakMap()

    onEmptyCallback()
    if (summary) summary.removeErrors()
    if (popup) popup.removeErrors()
  })

  /**
   * Setup form-level feedback tools such as popups or summaries.
   *
   * Depending on the configuration, this function initializes the
   * `withSummary` or `withPopup` integrations, enabling the form to
   * display inline or aggregated validation messages.
   *
   * These feedback tools are optional and modular — they can be
   * individually configured or disabled through the form options.
   */
  function setupFeedbacks() {
    const { withSummary, withPopup } = config

    // Initialize summary-based feedback if enabled.
    // The `useSummary` utility aggregates all errors into a list.
    if (withSummary) {
      const summaryOpts = typeof withSummary === 'object' ? withSummary : {}
      summary = useSummary(form, summaryOpts)
    }

    // Initialize popup-based feedback if enabled.
    // The `usePopup` utility provides contextual, per-field messages.
    if (withPopup) {
      const popupOpts = typeof withPopup === 'object' ? withPopup : {}
      popup = usePopup(form, popupOpts)
    }
  }

  /**
   * Retrieve the error message for a specific field.
   *
   * @param {HTMLElement} field - The field element to query.
   * @returns {string|undefined} The error message, or undefined if none exists.
   */
  function getError(field) {
    return errors.get(field)
  }

  /**
   * Retrieve a complete list of current validation errors.
   *
   * Iterates through all form elements, returning a collection
   * of `{ field, message }` objects for integration with UI layers
   * like summaries or popup displays.
   *
   * @returns {Array<{field: HTMLElement, message: string}>} Active form errors.
   */
  function getErrors() {
    const result = []

    // Iterate through form elements to ensure consistent order
    for (const field of form.elements) {
      if (errors.has(field)) {
        result.push({ field, message: errors.get(field) })
      }
    }

    return result
  }

  /**
   * Registers a callback for when a new error is added.
   *
   * @param {Function} cb - Callback invoked with `({ field, message })` arguments.
   */
  function onAdd(cb) {
    onAddCallback = cb
  }

  /**
   * Registers a callback for when a new error is updated.
   *
   * @param {Function} cb - Callback invoked with `({ field, message })` arguments.
   */
  function onChange(cb) {
    onChangeCallback = cb
  }

  /**
   * Registers a callback for when an error is removed.
   *
   * @param {Function} cb - Callback invoked with `({ field, message })` arguments.
   */
  function onRemove(cb) {
    onRemoveCallback = cb
  }

  /**
   * Registers a callback for when the form has been validated.
   *
   * @param {Function} cb - Callback invoked with `(errorsArray)` arguments.
   */
  function onCollect(cb) {
    onCollectCallback = cb
  }

  /**
   * Registers a callback for when the form has been reset.
   *
   * @param {Function} cb - Callback invoked with no arguments.
   */
  function onEmpty(cb) {
    onEmptyCallback = cb
  }

  // Return the reactive control interface
  return { onAdd, onChange, onRemove, onCollect, onEmpty, getErrors, getError }
}

/**
 * Executes automatic guidance actions after validation events.
 *
 * Handles accessibility-related guidance such as focusing or
 * scrolling to the first invalid form field, improving user
 * experience and discoverability of validation errors.
 *
 *
 * @param {Object} [options] - Optional configuration for focus/scroll behavior.
 * @param {boolean} [options.focusOnFirst=false] - Focus on the first invalid field when added.
 * @param {boolean} [options.scrollOnFirst=false] - Scroll to the first invalid field when added.
 *
 */
export function firstError(form, options) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[SF] firstError() requires a valid form element.')
  }

  // Initialize the internal validity watcher
  const validity = useValidity(form)

  // Default no-op callbacks to be replaced
  let onCaptureCallback = () => {}

  /**
   * Handle form validation failure event.
   *
   * Automatically focus on the first invalid field if enabled.
   * Automatically scroll the first invalid field into view if enabled.
   *
   * @param {Object} formErrors - List of invalid fields and their messages.
   */
  validity.onFail((formErrors) => {
    const firstError = formErrors[0]

    // Trigger focus on firstError
    if (options.focus) {
      firstError.field.focus({ preventScroll: true })
    }

    // Trigger scroll on firstError
    if (options.scroll) {
      let behavior = { behavior: 'smooth', block: 'center' }

      // Merge default scroll behaviors
      if (typeof options.scroll === 'object') {
        behavior = { ...behavior, ...options.scroll }
      }

      firstError.field.scrollIntoView(behavior)
    }

    onCaptureCallback(firstError)
  })

  /**
   * Registers a callback for when the first error triggers.
   *
   * @param {Function} cb - Callback invoked with `({ field, message })` arguments.
   */
  function onCapture(cb) {
    onCaptureCallback = cb
  }

  // Return the reactive control interface
  return { onCapture }
}

/* -------------------------------------------------------------------------- */
/* Internal Helpers                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Finds the first invalid form field, if none are currently focused.
 *
 * Scans the form for a field associated with an inline error element
 * via the `aria-describedby` attribute. Returns the field only when
 * the form has no focused input, ensuring user focus isn't interrupted.
 *
 * @param {HTMLFormElement} form - The form to search within.
 * @returns {HTMLElement|null} The first invalid field, or null if none found or a field is focused.
 */
export function getFirstInvalid(form) {
  const field = form.querySelector('[aria-describedby]')
  if (!(field instanceof HTMLElement)) return null

  // Verify that the referenced error element actually exists
  const describedId = field.getAttribute('aria-describedby')
  const error = describedId ? document.getElementById(describedId) : null

  // Return the field only if the associated error element exists
  return error instanceof HTMLElement ? field : null
}
