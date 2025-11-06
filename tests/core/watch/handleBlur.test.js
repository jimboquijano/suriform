/**
 * @file core/watch/handleBlur.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { handleBlur } from '../../../src/core/watch'
import * as validate from '../../../src/core/validate'

const htmlMap = {
  input: '<input type="text" />'
}

describe('handleBlur()', () => {
  let form, field

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.input))
    form.submit = vi.fn()
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('attaches a delegated blur listener to the form', async () => {
    const spyValidateField = vi.spyOn(validate, 'validateField').mockResolvedValue()
    handleBlur(form, { validateOnBlur: true })

    field.dispatchEvent(new Event('blur', { bubbles: true }))
    await Promise.resolve()

    expect(spyValidateField).toHaveBeenCalledWith(field)
    expect(form.__sfBlur).toBeDefined()
  })

  it('does not attach listener when `validateOnBlur` is false', () => {
    handleBlur(form, { validateOnBlur: false })
    expect(form.__sfBlur).toBeUndefined()
  })
})
