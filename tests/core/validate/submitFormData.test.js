/**
 * @file core/validate/submitFormData.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { submitFormData } from '../../../src/core/validate'

const htmlMap = {
  input: '<input type="text" />'
}

const mockSuccess = {
  ok: true,
  status: 200,
  json: async () => ({ success: true })
}

const mockError = {
  ok: false,
  status: 500
}

describe('submitFormData()', () => {
  let form

  beforeEach(() => {
    ;({ form } = createFormField(htmlMap.input))

    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    cleanupDocument()
    vi.unstubAllGlobals()
  })

  it('sends a POST request by default', async () => {
    form.setAttribute('action', '/test')
    form.setAttribute('method', 'POST')

    fetch.mockResolvedValueOnce(mockSuccess)
    const result = await submitFormData(form)

    expect(fetch).toHaveBeenCalledWith('/test', expect.objectContaining({ method: 'POST' }))
    expect(result).toBe(mockSuccess)
  })

  it('throws when form action URL is invalid', async () => {
    form.setAttribute('action', 'ftp://invalid')
    await expect(submitFormData(form)).rejects.toThrow(/Invalid form action/)
  })

  it('throws when response is not OK', async () => {
    form.setAttribute('action', '/test')

    fetch.mockResolvedValueOnce(mockError)
    await expect(submitFormData(form)).rejects.toThrow(/Request failed/)
  })
})
