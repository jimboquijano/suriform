/**
 * @file helpers/dom/getFormData.test.js
 */

import { describe, it, expect } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { getFormData } from '../../../src/helpers/dom'

const htmlMap = {
  single: '<input name="fruit" value="apple" />',
  keypair: `
	<input type="text" name="username" value="john" />
    <input type="email" name="email" value="john@example.com" />
  `,
  selectSingle: `
    <select name="city">
	  <option value="">Choose</option>
      <option value="tokyo" selected>Tokyo</option>
    </select>
    <textarea name="bio">Hello world</textarea>
 `,
  selectMulti: `
    <select name="pets" multiple>
      <option value="cat" selected>Cat</option>
      <option value="dog" selected>Dog</option>
      <option value="bird">Bird</option>
    </select>
  `,
  multiple: `
	<input type="checkbox" name="colors" value="red" checked />
    <input type="checkbox" name="colors" value="blue" checked />
    <input type="checkbox" name="colors" value="green" />
  `
}

describe('getFormData()', () => {
  afterEach(() => {
    cleanupDocument()
  })

  it('extracts key-value pairs from a simple form', () => {
    const { field } = createFormField(htmlMap.keypair)
    const data = getFormData(field.form)
    expect(data).toEqual({
      username: 'john',
      email: 'john@example.com'
    })
  })

  it('handles multiple fields with same name as array', () => {
    const { field } = createFormField(htmlMap.multiple)
    const data = getFormData(field.form)
    expect(data.colors).toEqual(['red', 'blue'])
  })

  it('returns single value when only one field of same name exists', () => {
    const { field } = createFormField(htmlMap.single)
    const data = getFormData(field.form)
    expect(data.fruit).toBe('apple')
  })

  it('handles select and textarea fields', () => {
    const { field } = createFormField(htmlMap.selectSingle)
    const data = getFormData(field.form)
    expect(data).toEqual({
      city: 'tokyo',
      bio: 'Hello world'
    })
  })

  it('handles multiple select options as array', () => {
    const { field } = createFormField(htmlMap.selectMulti)
    const data = getFormData(field.form)
    expect(data.pets).toEqual(['cat', 'dog'])
  })
})
