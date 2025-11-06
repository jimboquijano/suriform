/**
 * @file tools/popup/createWrapper.test.js
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { createWrapper } from '../../../src/tools/popup'

const htmlMap = {
  input: '<input type="text" />'
}

describe('createWrapper()', () => {
  let field, popups

  beforeEach(() => {
    ;({ field } = createFormField(htmlMap.input))
    popups = new Map()
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('creates a wrapper with the correct class and styles', () => {
    const wrapper = createWrapper(field, 'Error message', popups)

    expect(wrapper).toBeInstanceOf(HTMLElement)
    expect(wrapper.className).toBe('suriform-popup-wrapper')
    expect(wrapper.style.position).toBe('absolute')
    expect(wrapper.style.pointerEvents).toBe('none')
    expect(wrapper.style.zIndex).toBe('1000')
  })

  it('creates an inner popup with the correct class and message', () => {
    const wrapper = createWrapper(field, 'Error message', popups)
    const popup = wrapper.querySelector('.suriform-error-popup')

    expect(popup).toBeTruthy()
    expect(popup.textContent).toBe('Error message')
    expect(popup.style.position).toBeDefined()
  })

  it('appends the wrapper to the document body', () => {
    const wrapper = createWrapper(field, 'Error message', popups)
    expect(document.body.contains(wrapper)).toBe(true)
  })

  it('stores the wrapper in the popups map', () => {
    const wrapper = createWrapper(field, 'Error message', popups)
    expect(popups.get(field)).toBe(wrapper)
  })
})
