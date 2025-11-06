/**
 * @file core/validate/validateField.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { validateField } from '../../../src/core/validate'
import { defineRules, defineRule } from '../../../src/core/rules'
import { nativeRules } from '../../../src/rules'
import * as errorModule from '../../../src/core/error'

const htmlMap = {
  inputs: `
    <input type="text" required value="hello" />
	<input type="text" required value="" />
	<input type="text" async-rule value="ok" />
	<input type="text" async-rule value="bad" />
  `
}

describe('validateField()', () => {
  let form, field, field2, field3, field4

  beforeEach(() => {
    ;({ form, field, field2, field3, field4 } = createFormField(htmlMap.inputs))

    defineRules(nativeRules)
    form.__sfValidity = { _emit: vi.fn() }
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('returns a valid result for a valid form field', async () => {
    const result = await validateField(field)

    expect(result.isValid).toBe(true)
    expect(result.message).toBe('')
    expect(form.__sfValidity._emit).toHaveBeenCalledWith('onValid', {
      field,
      message: result.message
    })
  })

  it('returns an invalid result for an invalid form field', async () => {
    const result = await validateField(field2)

    expect(result.isValid).toBe(false)
    expect(result.message).toBe('This field is required.')
    expect(form.__sfValidity._emit).toHaveBeenCalledWith('onInvalid', {
      field: field2,
      message: result.message
    })
  })

  it('calls `hideError` for an invalid form field', async () => {
    const spyHideError = vi.spyOn(errorModule, 'hideError')
    await validateField(field)

    expect(spyHideError).toHaveBeenCalledWith(field, '')
  })

  it('calls `showError` for a invalid form field', async () => {
    const spyShowError = vi.spyOn(errorModule, 'showError')
    const result = await validateField(field2)

    expect(spyShowError).toHaveBeenCalledWith(field2, result.message)
  })

  it('sets and removes aria-busy during async validation', async () => {
    const result = await validateField(field)

    expect(result.isValid).toBe(true)
    expect(field.hasAttribute('aria-busy')).toBe(false)
  })

  it('handles async rules correctly', async () => {
    defineRule('async-rule', {
      message: 'Async rule failed.',
      validate: async (value) => {
        await new Promise((res) => setTimeout(res, 10))
        return value === 'ok'
      }
    })

    const validResult = await validateField(field3)
    const invalidResult = await validateField(field4)

    expect(validResult.isValid).toBe(true)
    expect(validResult.message).toBe('')
    expect(invalidResult.isValid).toBe(false)
    expect(invalidResult.message).toBe('Async rule failed.')
  })
})
