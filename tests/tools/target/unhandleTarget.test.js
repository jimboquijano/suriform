/**
 * @file tools/target/unhandleTarget.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { unhandleTarget } from '../../../src/tools/target'

const htmlMap = {
  inputs: `
    <input type="text" name="username" />
    <input type="email" name="email" />
    <input type="password" name="password" />
  `
}

describe('unhandleTarget()', () => {
  let field, field2, handler

  beforeEach(() => {
    ;({ field, field2 } = createFormField(htmlMap.inputs))
    handler = vi.fn()
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('removes event listeners from target elements', () => {
    const handlers = new Map([[field, [{ targetEl: field2, handler }]]])
    field2.addEventListener('input', handler)

    unhandleTarget(handlers)
    field2.dispatchEvent(new Event('input'))

    expect(handler).not.toHaveBeenCalled()
  })

  it('clears all entries from the handlers map', () => {
    const handlers = new Map([[field, [{ targetEl: field2, handler }]]])

    unhandleTarget(handlers)

    expect(handlers.size).toBe(0)
    expect(handlers.has(field)).toBe(false)
  })

  it('does not throw when called with an empty handlers map', () => {
    const handlers = new Map()
    expect(() => unhandleTarget(handlers)).not.toThrow()
  })
})
