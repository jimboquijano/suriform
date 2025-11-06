/**
 * @file tools/popup/positionPopup.test.js
 */

import { describe, it, expect } from 'vitest'
import { positionPopup } from '../../../src/tools/popup'
import { createPopupWrapper } from '../../utils/popup'

describe('positionPopup()', () => {
  it('positions the popup relative to the form field', () => {
    const { field, wrapper } = createPopupWrapper()

    field.getBoundingClientRect = () => ({
      left: 10,
      top: 10,
      bottom: 30,
      width: 100,
      height: 20
    })

    positionPopup(field, wrapper)
    expect(wrapper.style.left).toBe('10px')
    expect(wrapper.style.top).toBe('34px')
  })
})
