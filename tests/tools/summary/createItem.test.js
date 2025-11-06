/**
 * @file tools/summary/createItem.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { createItem } from '../../../src/tools/summary'

const htmlMap = {
  input: '<input type="text" name="email" />'
}

describe('createItem()', () => {
  let field

  beforeEach(() => {
    ;({ field } = createFormField(htmlMap.input))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('creates an <li> element with correct data attributes and text', () => {
    const message = 'Invalid input'
    const li = createItem(field, message, new Map())

    expect(li).toBeInstanceOf(HTMLLIElement)
    expect(li.dataset.fieldKey).toBe('email')
    expect(li.getAttribute('tabindex')).toBe('0')
    expect(li.textContent).toBe(message)
  })
})
