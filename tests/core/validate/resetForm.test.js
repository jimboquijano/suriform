/**
 * @file core/validate/resetForm.test.js
 */

import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { resetForm } from '../../../src/core/validate'
import * as errorModule from '../../../src/core/error'

const htmlMap = {
  invalid: `
    <input type="text" required value="" />
    <input type="text" required value="" />
  `,
  valid: `
    <input type="text" required value="foo" />
    <input type="text" required value="bar" />
  `
}

describe('resetForm()', () => {
  let spyClearError

  beforeEach(() => {
    spyClearError = vi.spyOn(errorModule, 'hideError')
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('calls `triggerHooks` and  `clearError` for each field', () => {
    const { form } = createFormField(htmlMap.invalid)
    const mockFields = Array.from(form.elements)
    resetForm(form)

    expect(spyClearError).toHaveBeenCalledTimes(mockFields.length)
    mockFields.forEach((field, i) => {
      expect(spyClearError).toHaveBeenNthCalledWith(i + 1, field)
    })
  })

  it('does not change field values when resetting', () => {
    const { form, field } = createFormField(htmlMap.valid)
    const originalValue = field.value
    resetForm(form)

    expect(field.value).toBe(originalValue)
    expect(spyClearError).toHaveBeenCalledWith(field)
  })
})
