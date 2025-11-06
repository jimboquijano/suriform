/**
 * @file utils/error.js
 * @description Helper utilities to create DOM elements for error-related tests.
 */

import { vi } from 'vitest'

/**
 * Creates a mock DOM structure for testing error-related utilities in Suriform.
 *
 * Generates a <form> with a single <input> and an associated error element (<div>),
 * appending all elements to the document body. Optionally mocks the `scrollIntoView`
 * method on the error element to allow testing scroll behavior without relying on jsdom.
 *
 * @param {Object} [options] - Optional configuration object.
 * @param {boolean} [options.withScrollMock=true] - If true, attaches a mock `scrollIntoView` function to the error element.
 * @returns {Object} An object containing references to the created elements:
 *   - `form`: The created <form> element.
 *   - `field`: The <input> element inside the form.
 *   - `errorEl`: The error <div> associated with the form field.
 *
 * @example
 * const { form, field, errorEl } = createErrorTestDom()
 * field.setAttribute('aria-describedby', 'error1')
 * errorEl.scrollIntoView() // safely mocked
 */

export function createErrorTestDom({ withScrollMock = true } = {}) {
  const form = document.createElement('form')
  const field = document.createElement('input')
  const errorEl = document.createElement('div')
  errorEl.id = 'error1'

  document.body.appendChild(form)
  document.body.appendChild(errorEl)
  form.appendChild(field)

  if (withScrollMock) errorEl.scrollIntoView = vi.fn()

  return { form, field, errorEl }
}
