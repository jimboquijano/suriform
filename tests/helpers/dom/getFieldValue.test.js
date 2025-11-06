/**
 * @file helpers/dom/getFieldValue.test.js
 */

import { describe, it, expect, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { getFieldValue } from '../../../src/helpers/dom'

const htmlMap = {
  value: '<input type="text" value="hello" />',
  taValue: '<textarea>abc</textarea>',
  cChecked: '<input type="checkbox" value="yes" checked />',
  cUnchecked: '<input type="checkbox" value="yes" />',
  rChecked: '<input type="radio" value="option1" checked />',
  rUnchecked: '<input type="radio" value="option1" />',
  disabled: '<input type="text" value="abc" disabled />',
  file: '<input type="file" />',
  ssValue: `
    <select>
      <option value="">Choose</option>
      <option value="1" selected>One</option>
    </select>
  `,
  ssNoValue: `
	<select>
	  <option value="">None</option>
	</select>
  `,
  msValue: `
    <select multiple>
      <option value="a" selected>A</option>
      <option value="b">B</option>
      <option value="c" selected>C</option>
    </select>
  `,
  msNoValue: `
    <select multiple>
      <option value="x">X</option>
      <option value="y">Y</option>
    </select>
  `
}

describe('getFieldValue()', () => {
  afterEach(() => {
    cleanupDocument()
  })

  it('returns text field value correctly', () => {
    const { field } = createFormField(htmlMap.value)
    expect(getFieldValue(field)).toBe('hello')
  })

  it('returns textarea value', () => {
    const { field } = createFormField(htmlMap.taValue)
    expect(getFieldValue(field)).toBe('abc')
  })

  it('returns single select value', () => {
    const { field } = createFormField(htmlMap.ssValue)
    expect(getFieldValue(field)).toBe('1')
  })

  it('returns empty string for unselected single select', () => {
    const { field } = createFormField(htmlMap.ssNoValue)
    expect(getFieldValue(field)).toBe('')
  })

  it('returns multi-select array', () => {
    const { field } = createFormField(htmlMap.msValue)
    expect(getFieldValue(field)).toEqual(['a', 'c'])
  })

  it('returns empty array for multi-select with no selection', () => {
    const { field } = createFormField(htmlMap.msNoValue)
    expect(getFieldValue(field)).toEqual([])
  })

  it('returns value for checked checkbox', () => {
    const { field } = createFormField(htmlMap.cChecked)
    expect(getFieldValue(field)).toBe('yes')
  })

  it('returns empty string for unchecked checkbox', () => {
    const { field } = createFormField(htmlMap.cUnchecked)
    expect(getFieldValue(field)).toBe('')
  })

  it('returns value for checked radio', () => {
    const { field } = createFormField(htmlMap.rChecked)
    expect(getFieldValue(field)).toBe('option1')
  })

  it('returns empty string for unchecked radio', () => {
    const { field } = createFormField(htmlMap.rUnchecked)
    expect(getFieldValue(field)).toBe('')
  })

  it('returns FileList for file field', () => {
    const { field } = createFormField(htmlMap.file)
    const file = new File(['content'], 'file.txt', { type: 'text/plain' })
    Object.defineProperty(field, 'files', { value: [file] })
    expect(getFieldValue(field)).toEqual([file])
  })

  it('returns null for empty file field', () => {
    const { field } = createFormField(htmlMap.file)
    Object.defineProperty(field, 'files', { value: [] })
    expect(getFieldValue(field)).toBeNull()
  })

  it('returns null for disabled form field', () => {
    const { field } = createFormField(htmlMap.disabled)
    expect(getFieldValue(field)).toBeNull()
  })

  it('returns null for null form field', () => {
    expect(getFieldValue(null)).toBeNull()
  })
})
