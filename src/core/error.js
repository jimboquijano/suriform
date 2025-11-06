/**
 * @file core/error.js
 * @description Unified error handling utilities for Suriform.
 *
 * Manages inline and summary errors, updates accessibility attributes,
 * and provides template support for consistent validation feedback.
 * Ensures errors remain synchronized with form validation state.
 */

import { escapeHtml } from '../helpers/format'

const errors = new WeakMap()
let errorUid = 0

/**
 * Display an inline error for a given form field.
 *
 * 1. Check if an error block already exists. If not, create one and cache it.
 * 2. Insert the error block after the field and assign an ID, role, and CSS class.
 * 3. Add accessibility ARIA attributes for the field and error block.
 * 3. Update the content of the error block with the provided message.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The form field to show the error for.
 * @param {string} message - The error message to display.
 */
export function showError(field, message) {
  if (field.form?.__sfInline === false) return
  let errorEl = errors.get(field)

  // Create new error block
  if (!errorEl) {
    const errorId = `suriform-${field.name}-error-${errorUid}`
    const content = getTemplate(field, message)

    field.setAttribute('aria-describedby', errorId)
    field.setAttribute('aria-invalid', 'true')
    field.insertAdjacentHTML('afterend', content)

    errorEl = field.nextElementSibling
    errors.set(field, errorEl)
    errorEl.setAttribute('role', 'alert')
    errorEl.classList.add('suriform-error')
    errorEl.id = errorId
  }

  // Update existing error block
  else {
    errorEl.textContent = message
  }
}

/**
 * Remove an inline error for a given form field.
 *
 * 1. Retrieve the active error block from the cache.
 * 2. Remove all the ARIA attributes from the fields.
 * 3. Remove the error block from the DOM.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The form field to clear the error for.
 */
export function hideError(field) {
  const errorEl = errors.get(field)

  // Revemo error block when present
  if (errorEl) {
    field.removeAttribute('aria-invalid')
    field.removeAttribute('aria-describedby')

    errorEl.remove()
    errors.delete(field)
  }
}

/**
 * Safely generate the custom or default error template.
 *
 * 1. Check if a custom `wrap` template function exists on the form.
 * 2. Call the template function with the message and field.
 * 3. If invalid or non-string output, fallback to default HTML template.
 * 4. Return the final HTML string to be inserted in the DOM.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The form field to get the template for.
 * @param {string} message - The error message to pass to the template.
 * @returns {string} HTML string of the error template.
 */
export function getTemplate(field, message) {
  let template = false

  // Interpolate the message
  if (field.form?.__sfMessage?.wrap) {
    template = field.form.__sfMessage.wrap({ field, message })
  }

  // Only allow string templates
  if (typeof template !== 'string') {
    template = `<div>${escapeHtml(message)}</div>`
  }

  return template
}
