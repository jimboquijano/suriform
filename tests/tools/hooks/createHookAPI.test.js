/**
 * @file tools/hooks/createHookAPI.test.js
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createHookAPI } from '../../../src/tools/hooks'

describe('createHookAPI()', () => {
  let form, listeners, api

  beforeEach(() => {
    form = document.createElement('form')
    listeners = { test: [] }
    api = createHookAPI(form, listeners)
  })

  it('creates a valid hook API object', () => {
    expect(api).toBeTypeOf('object')
    expect(api).toHaveProperty('el', form)
    expect(api).toHaveProperty('_emit')
    expect(typeof api._emit).toBe('function')
  })

  it('emits listeners via `_emit` safely', () => {
    const fn = vi.fn()
    listeners.test.push(fn)

    api._emit('test', 123)
    expect(fn).toHaveBeenCalledWith(123)
  })

  it('does not throw when a listener in `_emit` throws', () => {
    const bad = vi.fn(() => {
      throw new Error('boom')
    })

    listeners.test.push(bad)
    expect(() => api._emit('test')).not.toThrow()
  })
})
