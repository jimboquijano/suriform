/**
 * @file utils/main.js
 * @description Core utility functions for Suriform testing, including helpers to
 * create forl field elements, mock file form fields, clean up the DOM,
 * and retrieve numeric validation types. These utilities standardize test
 * setup and teardown, ensuring consistent behavior across validation tests.
 */

import { vi } from 'vitest'

/**
 * Create one or more generic form fields from an HTML string, optionally wrapped in a `<form>`.
 *
 * Builds a temporary `<form>` element and appends all parsed elements from the
 * provided HTML string. Each element is automatically marked as `required`
 * (if not already), ensuring consistent behavior across validation tests.
 *
 * @param {string} htmlString - Raw HTML markup containing one or more form fields.
 * @param {boolean} [withForm=true] - Whether to wrap the elements in a `<form>`.
 * @returns {Object} An object containing the field elements (and optionally the form).
 */
export function createFormField(htmlString, withForm = true) {
  const container = withForm ? document.createElement('form') : document.createDocumentFragment()
  const template = document.createElement('template')
  template.innerHTML = htmlString.trim()

  // Extract all top-level nodes from the parsed template
  const elements = Array.from(template.content.children)
  elements.forEach((el) => container.appendChild(el))

  // Append to DOM to simulate real browser environment
  document.body.appendChild(container)

  // Build return object dynamically: { form?, field, field2, field3, ... }
  const result = {}
  if (withForm) result.form = container

  elements.forEach((el, i) => {
    result[i === 0 ? 'field' : `field${i + 1}`] = el
  })

  return result
}

/**
 * Create a mock <input type="file"> element for file validation tests.
 *
 * Generates a realistic File object using the browser's built-in `File` constructor,
 * ensuring that `name` and `type` are properly assigned and not mutated later
 * (since these are read-only in jsdom). The `size` property can be overridden
 * using `Object.defineProperty` to simulate various file sizes for validation tests.
 *
 * @param {string} [attrs=''] - Optional HTML attributes to include on the form field.
 * @param {Object} [file={}] - Mock file metadata for simulation.
 * @param {string} [file.name='mock.jpg'] - The filename for the mock file.
 * @param {string} [file.type='image/jpeg'] - The MIME type for the mock file.
 * @param {number} [file.size] - Optional size (in bytes) to override the default.
 * @returns {HTMLInputElement} - The generated file form field with an attached mock FileList.
 */
export function makeFileField(attrs = '', file = {}) {
  const { field } = createFormField(`<input type="file" ${attrs} />`)

  // Create a mock File with valid name and type metadata
  const mockFile = new File(['dummy content'], file.name || 'mock.jpg', {
    type: file.type || 'image/jpeg'
  })

  // Override size if needed (cannot be passed via constructor)
  if (file.size) {
    Object.defineProperty(mockFile, 'size', { value: file.size })
  }

  // Attach a fake FileList containing our mock file
  Object.defineProperty(field, 'files', {
    value: [mockFile],
    writable: false
  })

  return field
}

/**
 * Creates a container <div> element appended to the document body.
 *
 * @returns {HTMLDivElement} The created container
 */
export function createContainer() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return container
}

/**
 * Cleanup the DOM after each test.
 */
export function cleanupDocument() {
  document.body.innerHTML = ''
}

/**
 * Helper function to return numeric type rules
 */
export const getNumericTypes = () => {
  return [
    'greater',
    'less',
    'greater-equal',
    'less-equal',
    'greater-than',
    'less-than',
    'greater-equal-to',
    'less-equal-to'
  ]
}
