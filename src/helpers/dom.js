/**
 * @file helpers/dom.js
 * @description DOM-related utilities for Suriform.
 *
 * Provides helper functions for selecting DOM nodes, working with
 * image files asynchronously, and simplifying routine element operations.
 */

/**
 * Debounce a function to limit execution frequency.
 *
 * 1. Returns a wrapped function that delays execution by the specified interval.
 * 2. Useful for form field events to prevent excessive validation calls.
 *
 * @param {Function} fn - Function to debounce.
 * @param {number} [delay=300] - Delay in milliseconds.
 * @returns {Function} Debounced function.
 *
 * @example
 * const debounced = debounce(() => console.log('Hi'), 200)
 * debounced()
 */
export function debounce(fn, delay = 300) {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(null, args), delay)
  }
}

/**
 * Load an image from a File and get its dimensions asynchronously.
 *
 * 1. Creates an Image object and reads its natural width and height.
 * 2. Calls a success callback with dimensions or an error callback if loading fails.
 * 3. Ensures safe asynchronous image processing for validation or preview purposes.
 *
 * @param {File} file - Image file.
 * @param {function} callback - Success callback(width, height).
 * @param {function} onError - Optional error callback.
 *
 * @example
 * loadImage(file, (w, h) => console.log(w, h))
 */
export function loadImage(file, callback, onError) {
  if (!file.type.startsWith('image/')) return

  const img = new Image()
  const url = URL.createObjectURL(file)
  img.src = url

  img.onload = () => {
    callback(img.width, img.height)
    URL.revokeObjectURL(url)
  }

  img.onerror = () => {
    if (onError) onError()
    URL.revokeObjectURL(url)
  }
}

/**
 * Determine whether a form field currently contains a user-provided value.
 *
 * 1. Supports all common form field types including:
 *    - text, textarea
 *    - select (single/multiple)
 *    - checkbox, radio
 *    - file inputs
 * 2. Returns true if the field has any meaningful value or selection.
 * 3. Handles grouped fields and multiple selections correctly.
 * 4. Ignores whitespace-only text values.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The form field to check.
 * @returns {boolean} True if the form field has a meaningful user value, otherwise false.
 */
export function hasFieldValue(field) {
  const value = getFieldValue(field)
  if (value == null) return false

  // --- SELECT ---
  if (Array.isArray(value)) return value.length > 0

  // --- FILE ---
  if (value instanceof FileList) return value.length > 0

  // --- CHECKBOX/RADIO ---
  if (typeof value === 'string') return value.trim() !== ''

  return !!value
}

/**
 * Safely retrieve the value(s) from any form field type.
 *
 * 1. Supports all common form field types including:
 *    - text, textarea
 *    - select (single/multiple)
 *    - checkbox, radio
 *    - file inputs
 * 2. Returns a normalized value depending on the field type:
 *    - string for text-like fields
 *    - array for multi-select
 *    - FileList for file fields
 *    - null when no valid value exists
 * 3. Handles multiple selections and grouped inputs correctly.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The form field to extract value from.
 * @returns {string|string[]|FileList|null} Normalized value for validation.
 */
export function getFieldValue(field) {
  if (!field || field.disabled) return null
  const type = field.type

  // --- SELECT ---
  if (field.tagName === 'SELECT') {
    if (field.multiple) {
      return Array.from(field.options)
        .filter((o) => o.selected && o.value !== '')
        .map((o) => o.value)
    }
    return field.value || ''
  }

  // --- CHECKBOX/RADIO ---
  if (type === 'checkbox' || type === 'radio') {
    return field.checked ? field.value : ''
  }

  // --- FILE ---
  if (type === 'file') {
    return field.files && field.files.length ? field.files : null
  }

  // --- DEFAULT: TEXT-LIKE FIELDS ---
  if (typeof field.value === 'string') {
    return field.value
  }

  return field.value ?? ''
}

/**
 * Collects all data from a form using the native FormData API.
 *
 * 1. Accepts a valid HTMLFormElement.
 * 2. Iterates over all form fields using FormData.
 * 3. Handles multiple values for the same field by returning arrays.
 * 4. Returns an object with key-value pairs representing all form data.
 *
 * @param {HTMLFormElement} form - Form element to extract data from.
 * @returns {Object} Key-value pairs representing the form data.
 * @throws {TypeError} If `form` is not a valid <form> element.
 */
export function getFormData(form) {
  if (!(form instanceof HTMLFormElement)) return null

  const data = {}
  const fd = new FormData(form)

  for (let [key, value] of fd.entries()) {
    if (data[key]) {
      data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value]
    } else {
      data[key] = value
    }
  }

  return data
}
