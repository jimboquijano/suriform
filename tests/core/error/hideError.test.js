/**
 * @file core/error/hideError.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { hideError, showError } from '../../../src/core/error'

const htmlMap = {
  input: '<input type="text" />'
}

describe('hideError()', () => {
  let field, form

  beforeEach(() => {
    ;({ field, form } = createFormField(htmlMap.input))

    showError(field, 'some error')

    form.__sfError = {
      _emit: vi.fn()
    }
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('removes the error element', () => {
    let errorEl = field.nextElementSibling
    expect(errorEl).toBeTruthy()

    hideError(field)
    errorEl = field.nextElementSibling
    expect(errorEl).toBeFalsy()
  })

  it('clears the ARIA attributes', () => {
    hideError(field)

    expect(field.hasAttribute('aria-invalid')).toBe(false)
    expect(field.hasAttribute('aria-describedby')).toBe(false)
  })
})
