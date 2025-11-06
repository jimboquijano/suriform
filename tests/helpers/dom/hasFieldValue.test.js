/**
 * @file helpers/dom/hasFieldValue.test.js
 */

import { describe, it, expect, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { hasFieldValue } from '../../../src/helpers/dom'

const htmlMap = {
  textValue: '<input type="text" value="hello" />',
  whitespace: '<input type="text" value="   " />',
  taValue: '<textarea>abc</textarea>',
  cChecked: '<input type="checkbox" value="yes" checked />',
  cUnchecked: '<input type="checkbox" value="yes" />',
  rChecked: '<input type="radio" value="option1" checked />',
  rUnchecked: '<input type="radio" value="option1" />',
  file: '<input type="file" />',
  ssValue: `
	<select>
      <option value="">Choose</option>
      <option value="1" selected>One</option>
    </select>
  `,
  ssNoValue: '<select><option value="">None</option></select>',
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

describe('hasFieldValue()', () => {
  afterEach(() => {
    cleanupDocument()
  })

  it('detects text field values correctly', () => {
    const { field } = createFormField(htmlMap.textValue)
    expect(hasFieldValue(field)).toBe(true)
  })

  it('ignores whitespace-only text values', () => {
    const { field } = createFormField(htmlMap.whitespace)
    expect(hasFieldValue(field)).toBe(false)
  })

  it('handles textarea values', () => {
    const { field } = createFormField(htmlMap.taValue)
    expect(hasFieldValue(field)).toBe(true)
  })

  it('handles single select', () => {
    const { field } = createFormField(htmlMap.ssValue)
    expect(hasFieldValue(field)).toBe(true)
  })

  it('handles empty single select', () => {
    const { field } = createFormField(htmlMap.ssNoValue)
    expect(hasFieldValue(field)).toBe(false)
  })

  it('handles multi-select', () => {
    const { field } = createFormField(htmlMap.msValue)
    expect(hasFieldValue(field)).toBe(true)
  })

  it('handles empty multi-select', () => {
    const { field } = createFormField(htmlMap.msNoValue)
    expect(hasFieldValue(field)).toBe(false)
  })

  it('handles checked checkbox', () => {
    const { field } = createFormField(htmlMap.cChecked)
    expect(hasFieldValue(field)).toBe(true)
  })

  it('handles unchecked checkbox', () => {
    const { field } = createFormField(htmlMap.cUnchecked)
    expect(hasFieldValue(field)).toBe(false)
  })

  it('handles checked radio', () => {
    const { field } = createFormField(htmlMap.rChecked)
    expect(hasFieldValue(field)).toBe(true)
  })

  it('handles unchecked radio', () => {
    const { field } = createFormField(htmlMap.rUnchecked)
    expect(hasFieldValue(field)).toBe(false)
  })

  it('handles file field', () => {
    const { field } = createFormField(htmlMap.file)
    const file = new File(['content'], 'file.txt', { type: 'text/plain' })
    Object.defineProperty(field, 'files', { value: [file] })
    expect(hasFieldValue(field)).toBe(true)
  })

  it('handles empty file field', () => {
    const { field } = createFormField(htmlMap.file)
    Object.defineProperty(field, 'files', { value: [] })
    expect(hasFieldValue(field)).toBe(false)
  })
})
