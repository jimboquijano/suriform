/**
 * @file core/validate/triggerHooks.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { validateForm, validateField } from '../../../src/core/validate'
import { triggerHooks, submitFormData } from '../../../src/core/validate'
import { defineRules } from '../../../src/core/rules'
import { nativeRules } from '../../../src/rules'

const htmlMap = {
  valid: `
    <input type="text" required value="foo" />
	<input type="text" required value="bar" />
  `,
  invalid: `
    <input type="text" required value="" />
    <input type="text" required value="" />
  `
}

const mockSuccess = {
  ok: true,
  status: 200,
  json: async () => ({
    status: 200,
    data: 'OK'
  })
}

const mockError = {
  ok: false,
  status: 500,
  json: async () => ({
    status: 500,
    error: 'Internal Server Error',
    message: 'Something went wrong on the server.'
  })
}

describe('triggerHooks()', () => {
  let form, form2, field, field2

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.valid))
    ;({ form: form2, field: field2 } = createFormField(htmlMap.invalid))

    defineRules(nativeRules)
    form.__sfValidity = { _emit: vi.fn() }
    form2.__sfValidity = { _emit: vi.fn() }
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('emits `onInvalid` hooks when a form field fails validation', async () => {
    const result = await validateField(field2)
    await triggerHooks(result, field2)

    expect(result.isValid).toBe(false)
    expect(form2.__sfValidity._emit).toHaveBeenCalledWith('onInvalid', {
      field: field2,
      message: result.message
    })
  })

  it('emits `onValid` hooks when a form field passes validation', async () => {
    const result = await validateField(field)
    await triggerHooks(result, field)

    expect(result.isValid).toBe(true)
    expect(form.__sfValidity._emit).toHaveBeenCalledWith('onValid', {
      field,
      message: result.message
    })
  })

  it('emits `onFail` hooks when a form is invalid during submit', async () => {
    const result = await validateForm(form2)
    await triggerHooks(result, form2)

    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(form2.__sfValidity._emit).toHaveBeenCalledWith('onFail', result.errors)
  })

  it('emits `onPass` hooks when a form is valid during submit', async () => {
    const result = await validateForm(form)
    await triggerHooks(result, form)

    expect(result.isValid).toBe(true)
    expect(result.errors.length).toBe(0)
    expect(form.__sfValidity._emit).toHaveBeenCalledWith('onPass', result.errors)
  })

  it('emits `onError` hooks when `AJAX handler` is set and AJAX fails', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockError)
    form.__sfAjax = { _emit: vi.fn() }

    const result = await validateForm(form)
    await triggerHooks(result, form)
    const emittedArg = form.__sfAjax._emit.mock.calls[0][1]

    expect(emittedArg).toBeInstanceOf(Error)
    expect(emittedArg.message).toBe('[SF] Request failed with status 500')
    expect(form.__sfAjax._emit).toHaveBeenCalledWith('onError', emittedArg)
  })

  it('emits `onSuccess` hooks when `AJAX handler` is set and AJAX succeeds', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockSuccess)
    form.__sfAjax = { _emit: vi.fn() }

    const result = await validateForm(form)
    await triggerHooks(result, form)
    const emittedArg = form.__sfAjax._emit.mock.calls[0][1]

    expect(emittedArg.ok).toBe(true)
    expect(emittedArg.status).toBe(200)
    expect(typeof emittedArg.json).toBe('function')
    expect(form.__sfAjax._emit).toHaveBeenCalledWith('onSuccess', emittedArg)
  })
})
