/**
 * @file tools/target/handleTarget.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { handleTarget } from '../../../src/tools/target'
import * as validateModule from '../../../src/core/validate'

const htmlMap = {
  inputs: `
	<input type="text" name="username" />
	<input type="email" name="email" />
	<input type="password" name="password" />
  `
}

describe('handleTarget()', () => {
  let form, field, handlers

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.inputs))
    handlers = new Map()
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('binds input event listeners to all target fields', async () => {
    const registry = [{ username: ['email', 'password'] }]
    const validateSpy = vi.spyOn(validateModule, 'validateField').mockResolvedValue(true)

    await handleTarget(form, registry, handlers)
    expect(handlers.size).toBe(1)

    for (const [key, entries] of handlers) {
      expect(key).toBe(field)
      expect(Array.isArray(entries)).toBe(true)
      expect(entries.length).toBe(2)

      entries.forEach(({ targetEl, handler }) => {
        expect(targetEl).toBeInstanceOf(HTMLInputElement)
        expect(typeof handler).toBe('function')
        targetEl.dispatchEvent(new Event('input'))
      })
    }

    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  it('accepts single string as target', async () => {
    const registry = [{ email: 'username' }]
    const validateSpy = vi.spyOn(validateModule, 'validateField').mockResolvedValue(true)

    await handleTarget(form, registry, handlers)
    expect(handlers.size).toBe(1)

    for (const [, entries] of handlers) {
      expect(Array.isArray(entries)).toBe(true)
      expect(entries.length).toBe(1)
      entries[0].targetEl.dispatchEvent(new Event('input'))
    }

    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  it('handles missing field gracefully', async () => {
    const registry = [{ nonExistent: 'other' }]
    await handleTarget(form, registry, handlers)
    expect(handlers.size).toBe(0)
  })
})
