/**
 * @file helpers/summary.js
 * @description Utility functions to set up DOM elements for summary-related tests.
 */

/**
 * Create a mock summary list `<ul>` for Suriform validation summaries.
 *
 * @param {Array<{fieldName: string}>} [items=[{ fieldName: 'field1' }]] - List of summary entries.
 * @returns {HTMLUListElement} The created `<ul>` element, appended to the document.
 */
export function createSummaryList(items = [{ fieldName: 'field1' }]) {
  const ul = document.createElement('ul')
  ul.className = 'suriform-summary'

  items.forEach((item) => {
    const li = document.createElement('li')
    li.dataset.fieldName = item.fieldName
    ul.appendChild(li)
  })

  document.body.appendChild(ul)
  return ul
}

/**
 * Create a new `<form>` element for testing, always with a summary wrapper.
 *
 * @returns {{form: HTMLFormElement, wrapper: HTMLDivElement}} The created form and wrapper.
 */
export function createSummaryContainer() {
  const form = document.createElement('form')
  const wrapper = document.createElement('div')
  wrapper.className = 'suriform-summary-wrapper'

  document.body.append(wrapper)
  document.body.append(form)

  return { form, wrapper }
}

/**
 * Get the summary <ul> element in the document.
 *
 */
export function getSummaryUl() {
  return document.querySelector('ul.suriform-summary')
}
