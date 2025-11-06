/**
 * @file tools/popup/cleanupPopup.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPopupWrapper } from '../../utils/popup'
import { cleanupDocument } from '../../utils/main'
import { cleanupPopup } from '../../../src/tools/popup'

describe('cleanupPopup()', () => {
  let field, wrapper, popups

  beforeEach(() => {
    ;({ field, wrapper } = createPopupWrapper())
    popups = new Map()
    popups.set(field, wrapper)
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('removes the event listeners and the reposition handler', () => {
    wrapper.__sfReposition = vi.fn()
    const repositionRef = wrapper.__sfReposition
    const spyEvent = vi.spyOn(window, 'removeEventListener')

    cleanupPopup(field, popups)
    expect(spyEvent).toHaveBeenCalledWith('scroll', repositionRef, true)
    expect(spyEvent).toHaveBeenCalledWith('resize', repositionRef)
    expect(wrapper.__sfReposition).toBeUndefined()
  })

  it('removes the wrapper element from the DOM', () => {
    cleanupPopup(field, popups)
    expect(document.body.contains(wrapper)).toBe(false)
  })

  it('removes the wrapper from the popups Map', () => {
    cleanupPopup(field, popups)
    expect(popups.has('field1')).toBe(false)
  })
})
