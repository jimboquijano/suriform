/**
 * @file core/rules/getContext.test.js
 */

import { describe, it, expect, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { getContext } from '../../../src/core/rules'

const htmlMap = {
  input: '<input type="text" />',
  params: '<input type="text" between="5,10" />',
  inputs: `
	<input name="age" value="25" />
    <input name="first_name" value="Alice" />
    <input name="other" value="xyz" />
  `
}

describe('getContext()', () => {
  afterEach(() => {
    cleanupDocument()
  })

  it('returns field name, type, and value', () => {
    const { field } = createFormField(htmlMap.inputs)
    const context = getContext(field)

    expect(context).toHaveProperty('field', 'age')
    expect(context).toHaveProperty('type', 'text')
    expect(context).toHaveProperty('value', '25')
  })

  it('returns attribute value and parameters', () => {
    const { field } = createFormField(htmlMap.params)
    const context = getContext(field, 'between')

    expect(context).toHaveProperty('attrValue', '5,10')
    expect(context).toHaveProperty('params', [5, 10])
  })
})
