/**
 * @file core/rules/getContext.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { getContext, defineRule, ruleRegistry } from '../../../src/core/rules'
import { between } from '../../../src/rules'

const htmlMap = {
  inputs: `
	<input name="age" foo="bar" hello="world" between="15,50" value="25" />
    <input name="first_name" value="John" />
	<input name="last_name" value="Doe" />
    <input name="other" value="xyz" />
  `
}

describe('getContext()', () => {
  let rule

  beforeEach(() => {
    defineRule('between', between)
    rule = ruleRegistry.between
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('returns field name, type, and value', () => {
    const { field } = createFormField(htmlMap.inputs)
    const context = getContext(field, rule)

    expect(context).toHaveProperty('field', 'age')
    expect(context).toHaveProperty('type', 'text')
    expect(context).toHaveProperty('value', '25')
  })

  it('returns attribute value and parameters', () => {
    const { field } = createFormField(htmlMap.inputs)
    const context = getContext(field, rule)

    expect(context).toHaveProperty('attrValue', '15,50')
    expect(context).toHaveProperty('params', [15, 50])
  })

  it('includes full form data when `checksTarget` is true', () => {
    const { field } = createFormField(htmlMap.inputs)
    const customRule = { ...rule, checksTarget: true }
    const context = getContext(field, customRule)

    expect(context.form).toBeTypeOf('object')
    expect(context.form).toMatchObject({
      age: '25',
      first_name: 'John',
      last_name: 'Doe',
      other: 'xyz'
    })
  })

  it('includes collected attributes when `collectAttrs` is defined', () => {
    const { field } = createFormField(htmlMap.inputs)
    const customRule = { ...rule, collectAttrs: ['foo', 'hello'] }
    const context = getContext(field, customRule)

    expect(context.attrs).toBeTypeOf('object')
    expect(context.attrs).toEqual({
      foo: 'bar',
      hello: 'world'
    })
  })
})
