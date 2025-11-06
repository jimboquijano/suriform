/**
 * @file core/watch/unhandleSubmit.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { handleSubmit, unhandleSubmit } from '../../../src/core/watch'

const htmlMap = {
  input: '<input type="text" />'
}

describe('unhandleSubmit()', () => {
  let field, form

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.input))
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('removes the attached submit handler on the form', () => {
    handleSubmit(form, { validateOnSubmit: true })
    expect(form.__sfSubmit).toBeTruthy()
    expect(form.__sfReset).toBeTruthy()

    unhandleSubmit(form)
    expect(form.__sfSubmit).toBeUndefined()
    expect(form.__sfReset).toBeUndefined()
  })
})
