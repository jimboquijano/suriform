/**
 * @file core/watch/handleSubmit.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { handleSubmit } from '../../../src/core/watch'
import * as validateModule from '../../../src/core/validate'

const htmlMap = {
  input: '<input type="text" />'
}

describe('handleSubmit()', () => {
  let form

  beforeEach(() => {
    ;({ form } = createFormField(htmlMap.input))
    form.submit = vi.fn()
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('attaches a delegated submit listener to the form', async () => {
    handleSubmit(form, { validateOnSubmit: true })
    const submitEvent = new Event('submit', { cancelable: true })
    const spyPreventDefault = vi.spyOn(submitEvent, 'preventDefault')

    form.dispatchEvent(submitEvent)
    await Promise.resolve()

    expect(spyPreventDefault).toHaveBeenCalled()
    expect(form.__sfSubmit).toBeDefined()
    expect(form.hasAttribute('novalidate')).toBe(true)
  })

  it('attaches a delegated reset listener to the form', () => {
    handleSubmit(form, { validateOnSubmit: true })
    const spyResetForm = vi.spyOn(validateModule, 'resetForm')
    form.dispatchEvent(new Event('reset'))

    expect(spyResetForm).toHaveBeenCalledWith(form)
    expect(form.__sfReset).toBeDefined()
  })

  it('does not attach listeners if `validateOnSubmit` is false', async () => {
    handleSubmit(form, { validateOnSubmit: false })
    const submitEvent = new Event('submit', { cancelable: true })
    const spyPrevent = vi.spyOn(submitEvent, 'preventDefault')

    form.dispatchEvent(submitEvent)
    await Promise.resolve()

    expect(form.__sfSubmit).toBeUndefined()
    expect(form.__sfReset).toBeUndefined()

    expect(spyPrevent).not.toHaveBeenCalled()
    expect(form.submit).not.toHaveBeenCalled()
  })
})
