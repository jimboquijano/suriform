/**
 * @file tools/summary/renderList.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument, createContainer } from '../../utils/main'
import { createSummaryList } from '../../../tests/utils/summary'
import { renderList, createItem } from '../../../src/tools/summary'

const htmlMap = {
  inputs: `
    <input type="text" name="field1" />
    <input type="text" id="field2" />
  `
}

describe('renderList()', () => {
  let field, field2, container, ul

  beforeEach(() => {
    ;({ field, field2 } = createFormField(htmlMap.inputs))

    ul = createSummaryList([])
    container = createContainer()
    container.appendChild(ul)
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('removes existing summary if there are no errors', () => {
    const errors = new Map()
    renderList(errors, container)
    expect(ul.children).toHaveLength(0)
  })

  it('creates a summary list with <li> elements for each error', () => {
    const errors = new Map()
    createItem(field, 'Invalid input', errors)
    createItem(field2, 'Invalid input', errors)
    renderList(errors, container)

    expect(ul).toBeTruthy()
    expect(ul.children).toHaveLength(2)
    expect(ul.children[0].dataset.fieldKey).toBe(field.name)
    expect(ul.children[1].textContent).toBe('Invalid input')
  })
})
