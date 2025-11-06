/**
 * @file tools/target.js
 * @description Suriform utility for watching dependency-based target field.
 *
 * Provides dynamic, attribute-driven target validation monitoring.
 * Watches form fields and their dependency targets, attaching and removing
 * listeners to ensure only relevant dependencies trigger validation updates.
 */

import { validateField } from '../core/validate'

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Initializes dynamic target dependency monitoring for a form.
 *
 * Scans all form fields within the provided form, attaches watchers for target
 * rules, and exposes `reconnect`/`disconnect` controls to start or stop
 * monitoring. Ensures cleanup of event listeners to prevent memory leaks.
 *
 * @param {HTMLFormElement} form - The form element to watch the target.
 * @param {Array} registry - Array of field/targets pair to watch over.
 * @returns {Object} Control interface with `watch` and `unwatch` methods.
 * @throws {TypeError} If `form` is not a valid <form> element.
 * @throws {TypeError} If `fields` is not an Array.
 */
export function watchTarget(form, registry) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[SF] watchTarget() requires a valid form element.')
  }

  if (!Array.isArray(registry)) {
    throw new TypeError('[SF] useRequired() requires a valid fields.')
  }

  // Stores event handler references per form field
  // Use Map instead of WeakMap to allow iteration
  const handlers = new Map()

  // Connect right away
  let connected = false
  reconnect()

  /**
   * Starts watching all relevant form fields for target dependencies.
   *
   * Iterates form fields and attaches form field listeners based on
   * dependency rules defined in the targets. Safe to call multiple
   * times; subsequent calls have no effect.
   */
  function reconnect() {
    if (connected) return
    connected = true

    handleTarget(form, registry, handlers)
  }

  /**
   * Stops watching form fields and cleans up all attached listeners.
   *
   * Iterates the Map of handlers and removes event listeners to ensure
   * proper memory cleanup. Safe to call even if `watch` was never invoked.
   */
  function disconnect() {
    if (!connected) return
    connected = false

    unhandleTarget(handlers)
  }

  return { reconnect, disconnect }
}

/* -------------------------------------------------------------------------- */
/* Internal Helpers                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Attach dependency watchers to a given form field.
 *
 * Checks each item on the `registry`, and attaches form field listeners.
 * Allows multiple targets to trigger validation for the same dependent field.
 *
 * @param {HTMLFormElement} form - The form that holds the fields.
 * @param {Array} registry - List of field/target pairs to watch.
 * @param {Map} handlers - Stores references for cleanup.
 */
export async function handleTarget(form, registry, handlers) {
  registry.forEach((item) => {
    const [fieldKey] = Object.keys(item)
    const fieldEl = form.querySelector(`[name="${fieldKey}"]`)
    if (!fieldEl) return

    // targets can be a single string or array
    const targets = Array.isArray(item[fieldKey]) ? item[fieldKey] : [item[fieldKey]]

    // get all target elements
    const targetEls = targets.flatMap((name) =>
      Array.from(form.querySelectorAll(`[name="${name}"]`))
    )

    // attach handlers for each target
    const entries = handlers.get(fieldEl) || []

    targetEls.forEach((targetEl) => {
      const handler = async () => await validateField(fieldEl)
      targetEl.addEventListener('input', handler)
      entries.push({ targetEl, handler })
    })

    // store all target-handler pairs for this field
    handlers.set(fieldEl, entries)
  })
}

/**
 * Detach dependency watchers from all form fields.
 *
 * Iterates the Map of handlers, removes event listeners, and clears
 * the map. Ensures all resources are released to prevent leaks.
 *
 * @param {Map} handlers - Map of form fields to their attached handlers.
 */
export function unhandleTarget(handlers) {
  for (const [fieldEl, entries] of handlers) {
    entries.forEach(({ targetEl, handler }) => {
      targetEl.removeEventListener('input', handler)
    })
    handlers.delete(fieldEl)
  }
}
