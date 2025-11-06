/**
 * @file tools/popup/withPopup.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { getPopupWrap, getPopupWraps } from '../../utils/popup'
import { withPopup } from '../../../src/tools/popup'

const htmlMap = {
  inputs: `
    <input type="text" />
    <input type="text" />
  `
}

describe('withPopup()', () => {
  let form, field, field2, popup

  beforeEach(() => {
    ;({ form, field, field2 } = createFormField(htmlMap.inputs))
    popup = withPopup(form)
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('throws if not passed a valid form element', () => {
    expect(() => withPopup(null)).toThrow('[SF] withPopup() requires a valid form element.')
  })

  it('creates a popup when `addError` is called', () => {
    popup.addError(field, 'Error message')
    const wrapper = getPopupWrap()
    expect(wrapper).toBeTruthy()
    expect(wrapper.firstElementChild.textContent).toBe('Error message')
  })

  it('removes popup when `removeError` is called', () => {
    popup.addError(field, 'Error message')
    popup.removeError(field)
    expect(getPopupWrap()).toBeNull()
  })

  it('renders multiple popups from `addErrors`', () => {
    const popupMulti = withPopup(form, { displaySingle: false })

    popupMulti.addErrors([
      { field, message: 'First' },
      { field: field2, message: 'Second' }
    ])

    const wrappers = getPopupWraps()
    expect(wrappers.length).toBe(2)
  })

  it('removes all popups except specified one using `removeErrors`', () => {
    popup.addError(field, 'Error 1')
    popup.addError(field2, 'Error 2')
    popup.removeErrors(field2)

    const wrappers = getPopupWraps()
    expect(wrappers.length).toBe(1)
    expect(wrappers[0].textContent).toBe('Error 2')
  })

  it('does not duplicate popups when called repeatedly for same field', () => {
    popup.addError(field, 'One')
    popup.addError(field, 'Two')

    const wrappers = getPopupWraps()
    expect(wrappers.length).toBe(1)
    expect(wrappers[0].textContent).toBe('Two')
  })

  it('skips showing popup for invalid element types', () => {
    const notField = document.createElement('div')
    expect(() => popup.addError(notField, 'Should not show')).not.toThrow()
    expect(getPopupWrap()).toBeNull()
  })

  it('respects `displaySingle` configuration', () => {
    const popupSingle = withPopup(form, { displaySingle: true })
    popupSingle.addError(field, 'First')
    popupSingle.addError(field2, 'Second')

    const wrappers = getPopupWraps()
    expect(wrappers.length).toBe(1)
    expect(wrappers[0].textContent).toBe('Second')
  })

  it('allows multiple popups when `displaySingle` is false', () => {
    const popupMulti = withPopup(form, { displaySingle: false })
    popupMulti.addError(field, 'First')
    popupMulti.addError(field2, 'Second')

    const wrappers = getPopupWraps()
    expect(wrappers.length).toBe(2)
  })

  it('reuses the same popup wrapper when updating the message', () => {
    popup.addError(field, 'First message')
    const firstWrap = getPopupWrap()

    popup.addError(field, 'Updated message')
    const secondWrap = getPopupWrap()

    expect(firstWrap).toBe(secondWrap)
  })

  it('repositions popups when the window is scrolled or resized', () => {
    const spy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())

    popup.addError(field, 'Scroll test')
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('resize'))

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('does not throw when hiding a detached field', () => {
    const detached = document.createElement('input')
    expect(() => popup.removeError(detached)).not.toThrow()
  })

  it('does not crash when showing a field outside the form', () => {
    const outForm = document.createElement('input')
    document.body.appendChild(outForm)

    expect(() => popup.addError(outForm, 'Ignore')).not.toThrow()
    expect(getPopupWrap()).toBeNull()
    outForm.remove()
  })

  it('throws when `addErrors` is called with non-array', () => {
    expect(() => popup.addErrors(null)).toThrow()
    expect(() => popup.addErrors({})).toThrow()
  })
})
