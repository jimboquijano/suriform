/**
 * @file tools/popup/outsideClose.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, createContainer, cleanupDocument } from '../../utils/main'
import { outsideClose } from '../../../src/tools/popup'

describe('outsideClose()', () => {
  let form, field, outside, hideError

  beforeEach(() => {
    ;({ form, field } = createFormField('<input type="text" />'))
    outside = createContainer()

    hideError = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanupDocument()
    vi.useRealTimers()
  })

  it('calls `hideError` when clicking outside the popup', () => {
    outsideClose(field, hideError)
    vi.runAllTimers()

    outside.click()
    expect(hideError).toHaveBeenCalledWith(field)
  })

  it('does not call `hideError` when clicking inside form field or wrapper', () => {
    outsideClose(field, hideError)
    vi.runAllTimers()

    form.click()
    expect(hideError).not.toHaveBeenCalled()
  })
})
