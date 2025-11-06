/**
 * @file core/validate/validateForm.test.js
 */

import { describe, it, expect, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { validateForm } from '../../../src/core/validate'

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

describe('validateForm()', () => {
  afterEach(() => {
    cleanupDocument()
  })

  it('throws if not passed a valid form element', async () => {
    await expect(() => validateForm(null)).rejects.toThrow(TypeError)
    await expect(() => validateForm({})).rejects.toThrow(TypeError)
  })

  it('returns valid results when all form fields are valid', async () => {
    const { form } = createFormField(htmlMap.valid)
    const result = await validateForm(form, false)

    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('returns invalid results when one form field is invalid', async () => {
    const { form } = createFormField(htmlMap.invalid)
    const result = await validateForm(form, false)

    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(2)

    result.errors.forEach((err) => {
      expect(err.field).toBeInstanceOf(HTMLInputElement)
      expect(err.message).toBe('This field is required.')
    })
  })

  it('stops validation on first error when `stopOnFirstError` is true', async () => {
    const { form } = createFormField(htmlMap.invalid)
    const result = await validateForm(form)

    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].field).toBeInstanceOf(HTMLInputElement)
  })
})
