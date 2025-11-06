/**
 * @file tools/error/handleErrors.test.js
 */

import { createFormField, cleanupDocument } from '../../utils/main'
import { getFirstInvalid } from '../../../src/tools/errors'
import { showError } from '../../../src/core/error'

const htmlMap = {
  input: '<input type="text" />'
}

const invalidResult = {
  isValid: false,
  message: 'Invalid input'
}

describe('getFirstInvalid()', () => {
  let form, field

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.input))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('returns null if no invalid field exists', () => {
    expect(getFirstInvalid(form)).toBeNull()
  })

  it('returns the first invalid field with existing error element', () => {
    showError(field, 'Invalid input')
    expect(getFirstInvalid(form)).toBe(field)
  })
})
