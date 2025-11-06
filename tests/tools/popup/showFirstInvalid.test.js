/**
 * @file tools/popup/showFirstInvalid.test.js
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { showFirstInvalid } from '../../../src/tools/popup'
import { showError } from '../../../src/core/error'

const htmlMap = {
  inputs: `
    <input type="text" />
	<input type="text" />
  `
}

describe('showFirstInvalid()', () => {
  let field, field2

  beforeEach(() => {
    ;({ field, field2 } = createFormField(htmlMap.inputs))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('calls `showError` for the first invalid element with aria-describedby', () => {
    showError(field, 'Invalid input')
    const showInvalid = vi.fn()

    showFirstInvalid(field2, showInvalid)
    expect(showInvalid).toHaveBeenCalledWith(field, 'Invalid input')
  })

  it('does not call `showError` if no invalid fields exist', () => {
    const showInvalid = vi.fn()

    showFirstInvalid(field, showInvalid)
    expect(showInvalid).not.toHaveBeenCalled()
  })

  it('does not call `showError` if the field and first invalid are the same', () => {
    showError(field, 'Invalid input')
    const showInvalid = vi.fn()

    showFirstInvalid(field, showInvalid)
    expect(showInvalid).not.toHaveBeenCalled()
  })

  it('does not call `showError` if aria-describedby is missing or empty', () => {
    showError(field, 'Invalid input')
    field.removeAttribute('aria-describedby')
    const showInvalid = vi.fn()

    showFirstInvalid(field2, showInvalid)
    expect(showInvalid).not.toHaveBeenCalled()
  })
})
