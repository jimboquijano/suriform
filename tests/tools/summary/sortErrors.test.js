/**
 * @file tools/summary/sortErrors.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { sortErrors, createItem } from '../../../src/tools/summary'

const htmlMap = {
  inputs: `
    <input type="text" name="alpha" />
    <input type="text" name="beta" />
    <input type="text" name="gamma" />
  `
}

describe('sortErrors()', () => {
  let field, field2, field3

  beforeEach(() => {
    ;({ field, field2, field3 } = createFormField(htmlMap.inputs))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('sorts errors based on field order map', () => {
    const errors = new Map()
    createItem(field, 'Invalid input', errors)
    createItem(field2, 'Invalid input', errors)

    const fieldOrder = new Map()
    fieldOrder.set('beta', 1)
    fieldOrder.set('alpha', 2)

    const result = Array.from(sortErrors(errors, fieldOrder).keys())
    expect(result).toEqual([field2, field])
  })

  it('keeps unknown fields at the end', () => {
    const errors = new Map()
    createItem(field3, 'Invalid input', errors)
    createItem(field2, 'Invalid input', errors)

    const fieldOrder = new Map()
    fieldOrder.set('beta', 1)

    const result = Array.from(sortErrors(errors, fieldOrder).keys())
    expect(result).toEqual([field2, field3])
  })
})
