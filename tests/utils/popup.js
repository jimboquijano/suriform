/**
 * @file utils/popup.js
 * @description Helper functions to create DOM elements for popup tests
 */

/**
 * Creates a dummy form field and wrapper with a popup inside.
 *
 * @param {Object} options - Optional overrides
 * @param {boolean} addToBody - Whether to append wrapper to document.body
 * @returns {{ field: HTMLInputElement, wrapper: HTMLDivElement, popup: HTMLDivElement }}
 */
export function createPopupWrapper({ addToBody = true } = {}) {
  const field = document.createElement('input')
  const wrapper = document.createElement('div')
  const popup = document.createElement('div')

  wrapper.appendChild(popup)
  wrapper.className = 'suriform-popup-wrapper'

  if (addToBody) document.body.appendChild(wrapper)

  return { field, wrapper, popup }
}

/**
 * Get the first popup wrapper element in the document.
 *
 */
export function getPopupWrap() {
  return document.querySelector('.suriform-popup-wrapper')
}

/**
 * Get all popup wrapper elements in the document
 *
 */
export function getPopupWraps() {
  return document.querySelectorAll('.suriform-popup-wrapper')
}
