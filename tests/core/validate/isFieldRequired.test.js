/**
 * @file core/validate/isFieldRequired.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { isFieldRequired } from '../../../src/core/validate'
import { defineRule } from '../../../src/core/rules'
import { requiredIf } from '../../../src/rules'

const htmlMap = {
  valid: `
    <input type="text" required-if="target:on" />
    <input type="checkbox" name="target" checked />
  `,
  invalid: `
    <input type="text" required-if="target:on" />
    <input type="checkbox" name="target" />
  `
}

describe('isFieldRequired', () => {
  beforeEach(() => {
    defineRule('requiredIf', requiredIf)
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('marks form field as required when conditional passes', async () => {
    const { field } = createFormField(htmlMap.valid)
    const isRequired = await isFieldRequired(field)

    expect(isRequired).toBe(true)
  })

  it('marks form field as optional when conditional fails', async () => {
    const { field } = createFormField(htmlMap.invalid)
    const isRequired = await isFieldRequired(field)

    expect(isRequired).toBe(false)
  })
})
