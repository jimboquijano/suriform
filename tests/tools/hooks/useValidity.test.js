/**
 * @file tools/hooks/useValidity.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { useValidity } from '../../../src/tools/hooks'

const htmlMap = {
  input: '<input type="text" />'
}

describe('useValidity()', () => {
  let field, form

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.input))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('throws if not passed a valid form element', () => {
    expect(() => useValidity(null)).toThrow('[SF] useValidity() requires a valid form element.')
  })

  it('returns the same instance on repeated calls', () => {
    const c1 = useValidity(form)
    const c2 = useValidity(form)
    expect(c1).toBe(c2)
  })

  it('registers and emits all error hook types', () => {
    const api = useValidity(form)
    const valid = vi.fn()
    const invalid = vi.fn()
    const validate = vi.fn()

    api.onValid(valid)
    api.onInvalid(invalid)
    api.onFail(validate)
    api.onPass(validate)

    api._emit('onValid', field, { ok: true })
    api._emit('onInvalid', field, { ok: false })
    api._emit('onFail', form, { validate: true })
    api._emit('onPass', form, { validate: false })

    expect(valid).toHaveBeenCalled()
    expect(invalid).toHaveBeenCalled()
    expect(validate).toHaveBeenCalled()
  })
})
