/**
 * @file tools/hooks/useAjax.test.js
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAjax } from '../../../src/tools/hooks'

describe('useAjax()', () => {
  let form

  beforeEach(() => {
    document.body.innerHTML = '<form></form>'
    form = document.querySelector('form')
  })

  it('throws if not passed a valid form element', () => {
    expect(() => useAjax(null)).toThrow('[SF] useAjax() requires a valid form element.')
  })

  it('returns the same instance on repeated calls', () => {
    const api1 = useAjax(form)
    const api2 = useAjax(form)
    expect(api1).toBe(api2)
  })

  it('registers `onSuccess` and `onError` listeners correctly', () => {
    const api = useAjax(form)
    const fnSuccess = vi.fn()
    const fnError = vi.fn()

    api.onSuccess(fnSuccess)
    api.onError(fnError)

    api._emit('onSuccess', 'ok', form)
    api._emit('onError', 'bad', form)

    expect(fnSuccess).toHaveBeenCalledWith('ok', form)
    expect(fnError).toHaveBeenCalledWith('bad', form)
  })

  it('ignores invalid listener registrations', () => {
    const api = useAjax(form)
    expect(() => api.onSuccess('nope')).not.toThrow()
  })
})
