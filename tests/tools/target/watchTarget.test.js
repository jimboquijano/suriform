/**
 * @file tools/target/watchTarget.test.js
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { watchTarget } from '../../../src/tools/target'

const htmlMap = {
  input: '<input type="text" name="username" />'
}

describe('watchTarget()', () => {
  let form, registry

  beforeEach(() => {
    ;({ form } = createFormField(htmlMap.input))
    registry = []
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('throws if not passed a valid form element', () => {
    expect(() => watchTarget(null)).toThrow('[SF] watchTarget() requires a valid form element.')
  })

  it('throws if registry is not an array', () => {
    expect(() => watchTarget(form, null)).toThrow('[SF] useRequired() requires a valid fields.')
  })

  it('returns a controller with `reconnect` and `disconnect` methods', () => {
    const ctrl = watchTarget(form, registry)
    expect(ctrl).toHaveProperty('reconnect')
    expect(ctrl).toHaveProperty('disconnect')
    expect(typeof ctrl.reconnect).toBe('function')
    expect(typeof ctrl.disconnect).toBe('function')
  })

  it('allows multiple `reconnect` calls safely', () => {
    const ctrl = watchTarget(form, registry)
    ctrl.reconnect()
    ctrl.reconnect()
    expect(typeof ctrl.reconnect).toBe('function')
  })

  it('allows multiple `disconnect` calls safely', () => {
    const ctrl = watchTarget(form, registry)
    ctrl.disconnect()
    expect(() => ctrl.disconnect()).not.toThrow()
  })
})
