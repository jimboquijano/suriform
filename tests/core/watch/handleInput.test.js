/**
 * @file core/watch/handleInput.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { handleInput } from '../../../src/core/watch'
import * as validate from '../../../src/core/validate'

const htmlMap = {
  input: '<input type="text" />'
}

describe('handleInput()', () => {
  let form, field

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.input))
    form.submit = vi.fn()
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('attaches a delegated input listener to the form', async () => {
    const spyValidateField = vi.spyOn(validate, 'validateField').mockResolvedValue()
    handleInput(form, { validateOnInput: true })

    field.value = 'abc'
    field.dispatchEvent(new Event('input', { bubbles: true }))
    await Promise.resolve()

    expect(spyValidateField).toHaveBeenCalledWith(field)
    expect(form.__sfInput).toBeDefined()
  })

  it('does not attach listener when `validateOnInput` is false', () => {
    handleInput(form, { validateOnInput: false })
    expect(form.__sfInput).toBeUndefined()
  })
})
