/**
 * @file tools/popup/getFirstInvalid.test.js
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { getFirstInvalid } from '../../../src/tools/popup'
import { showError } from '../../../src/core/error'

const htmlMap = {
  inputs: `
    <input type="text" />
    <input type="text" /> 
  `
}

describe('getFirstInvalid()', () => {
  let form, field, field2

  beforeEach(() => {
    ;({ form, field, field2 } = createFormField(htmlMap.inputs))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('returns first invalid field in DOM order', () => {
    showError(field, 'Invalid input')
    showError(field2, 'Invalid input')
    expect(getFirstInvalid(form)).toBe(field)
  })

  it('returns null when no invalid fields', () => {
    expect(getFirstInvalid(form)).toBeNull()
  })
})
