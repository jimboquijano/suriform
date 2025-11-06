/**
 * @file tools/summary/withSummary.test.js
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { getSummaryUl } from '../../utils/summary'
import { withSummary } from '../../../src/tools/summary'
import { showError } from '../../../src/core/error'

const htmlMap = {
  inputs: `
    <input type="text" name="field1" />
    <input type="text" id="field2" />
  `
}

describe('withSummary()', () => {
  let form, field, field2, summary

  beforeEach(() => {
    ;({ form, field, field2 } = createFormField(htmlMap.inputs))
    showError(field, 'Required')
    showError(field2, 'Required')

    summary = withSummary(form)
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('throws if not passed a valid form element', () => {
    expect(() => withSummary(null)).toThrow('[SF] withSummary() requires a valid form element.')
  })

  it('adds a summary entry when `addError` is called', async () => {
    summary.addError(field, 'Required')
    const ul = getSummaryUl()

    expect(ul).toBeTruthy()
    expect(ul.children).toHaveLength(1)
    expect(ul.children[0].dataset.fieldKey).toBe(field.name)
    expect(ul.children[0].textContent).toBe('field1: Required')
  })

  it('removes a summary entry when `removeError` is called', async () => {
    summary.addError(field, 'Required')
    summary.removeError(field)
    expect(getSummaryUl()).toBeNull()
  })

  it('renders multiple errors from `addErrors`', async () => {
    summary.addErrors([
      { field, message: 'First' },
      { field: field2, message: 'Second' }
    ])

    const ul = getSummaryUl()
    expect(ul.children).toHaveLength(2)
    expect(ul.children[0].textContent).toBe('field1: First')
    expect(ul.children[1].textContent).toBe('field2: Second')
  })

  it('removes all errors except specified one using `removeErrors`', async () => {
    summary.addErrors([
      { field, message: 'First' },
      { field: field2, message: 'Second' }
    ])

    summary.removeErrors(field2)
    const ul = getSummaryUl()

    expect(ul.children).toHaveLength(1)
    expect(ul.children[0].textContent).toBe('field2: Second')
  })

  it('ignores invalid fields', async () => {
    const badField = document.createElement('input')
    summary.addError(badField, 'Oops')
    expect(getSummaryUl()).toBeNull()
  })

  it('throws when `addErrors` is called with non-array', () => {
    expect(() => summary.addErrors(null)).toThrow()
    expect(() => summary.addErrors({})).toThrow()
  })
})
