/**
 * @file tools/popup/updateExisting.test.js
 */

import { describe, it, expect } from 'vitest'
import { updateExisting } from '../../../src/tools/popup'
import { createPopupWrapper } from '../../utils/popup'

describe('updateExisting()', () => {
  it('updates existing popup message and repositions it', () => {
    const { field, wrapper, popup } = createPopupWrapper()
    popup.textContent = 'Old message'

    updateExisting(wrapper, 'New message', field)
    expect(wrapper.firstElementChild.textContent).toBe('New message')
  })
})
