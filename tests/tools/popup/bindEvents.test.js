/**
 * @file tools/popup/bindEvents.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPopupWrapper } from '../../utils/popup'
import { cleanupDocument } from '../../utils/main'
import * as popupModule from '../../../src/tools/popup'

describe('bindEvents()', () => {
  let wrapper, field, hideError, positionAll

  beforeEach(() => {
    ;({ field, wrapper } = createPopupWrapper())
    hideError = vi.fn()
    positionAll = vi.fn()
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('adds scroll and resize event listeners', () => {
    const spyEvent = vi.spyOn(window, 'addEventListener')
    popupModule.bindEvents(wrapper, positionAll)

    expect(spyEvent).toHaveBeenCalledWith('scroll', expect.any(Function), true)
    expect(spyEvent).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('stores a reposition handler on the wrapper', () => {
    popupModule.bindEvents(wrapper, positionAll)
    expect(typeof wrapper.__sfReposition).toBe('function')
  })

  it('sets up `outsideClose` to be called with correct arguments', () => {
    const outsideCloseSpy = vi.spyOn(popupModule, 'outsideClose').mockImplementation(() => {})
    popupModule.bindEvents(wrapper, positionAll)

    wrapper.__sfReposition?.()
    outsideCloseSpy(field, wrapper, hideError)

    expect(outsideCloseSpy).toHaveBeenCalledWith(field, wrapper, hideError)
    outsideCloseSpy.mockRestore()
  })
})
