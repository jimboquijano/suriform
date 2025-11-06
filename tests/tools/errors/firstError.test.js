/**
 * @file tools/error/firstError.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { firstError } from '../../../src/tools'
import { useValidity } from '../../../src/tools'

vi.mock('../../../src/tools/hooks', () => ({
  useValidity: vi.fn(() => ({
    onFail: vi.fn((cb) => {
      useValidity.__cb = cb
    })
  }))
}))

describe('firstError()', () => {
  let form, field

  beforeEach(() => {
    ;({ form, field } = createFormField('<input type="text" name="email" />'))
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('throws if not passed a valid form element', () => {
    expect(() => firstError(null)).toThrow('[SF] firstError() requires a valid form element.')
  })

  it('focuses the first invalid field when `options.focus` is true', () => {
    const focusSpy = vi.fn()
    field.focus = focusSpy

    const { onCapture } = firstError(form, { focus: true })
    const captureSpy = vi.fn()
    onCapture(captureSpy)

    // Trigger a fail event manually
    useValidity.__cb([{ field, message: 'Invalid email' }])

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
    expect(captureSpy).toHaveBeenCalledWith({ field, message: 'Invalid email' })
  })

  it('scrolls the first invalid field when `options.scroll` is true', () => {
    const scrollSpy = vi.fn()
    field.scrollIntoView = scrollSpy

    const { onCapture } = firstError(form, { scroll: true })
    const captureSpy = vi.fn()
    onCapture(captureSpy)

    useValidity.__cb([{ field, message: 'Required field' }])

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })
    expect(captureSpy).toHaveBeenCalledWith({ field, message: 'Required field' })
  })

  it('merges custom scroll options when scroll is an object', () => {
    const scrollSpy = vi.fn()
    field.scrollIntoView = scrollSpy

    const customScroll = { behavior: 'auto', block: 'nearest' }
    firstError(form, { scroll: customScroll })
    useValidity.__cb([{ field, message: 'Invalid input' }])

    expect(scrollSpy).toHaveBeenCalledWith(expect.objectContaining(customScroll))
  })

  it('triggers both focus and scroll when both options are true', () => {
    const focusSpy = vi.fn()
    const scrollSpy = vi.fn()
    field.focus = focusSpy
    field.scrollIntoView = scrollSpy

    firstError(form, { focus: true, scroll: true })
    useValidity.__cb([{ field, message: 'Invalid value' }])

    expect(focusSpy).toHaveBeenCalled()
    expect(scrollSpy).toHaveBeenCalled()
  })
})
