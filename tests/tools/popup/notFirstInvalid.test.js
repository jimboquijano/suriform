/**
 * @file tools/popup/notFirstInvalid.test.js
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { notFirstInvalid } from '../../../src/tools/popup'
import { showError } from '../../../src/core/error'

const htmlMap = {
  inputs: `
	<input type="text" />
	<input type="text" />
  `
}

describe('notFirstInvalid()', () => {
  let field, field2

  beforeEach(() => {
    ;({ field, field2 } = createFormField(htmlMap.inputs))
    showError(field, 'Invalid input')
    showError(field2, 'Invalid input')
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('returns false when field is focused', () => {
    field.focus()
    expect(notFirstInvalid(field)).toBe(false)
  })

  it('returns false when field is blured and is first invalid', () => {
    field.blur()
    expect(notFirstInvalid(field)).toBe(false)
  })

  it('returns true when field is blured and is not first invalid', () => {
    field2.blur()
    expect(notFirstInvalid(field2)).toBe(true)
  })
})
