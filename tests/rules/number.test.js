/**
 * @file rules/number.test.js
 * @description Unit tests for numeric validation rules.
 *
 * Covers: integer, numeric, digits, between.
 * Tests valid and invalid numeric form fields.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { numberRules } from '../../src/rules'

describe('Number Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  const htmlMap = {
    integer: {
      valid: `<input type="text" integer value="42" />`,
      invalid: `<input type="text" integer value="3.14" />`
    },
    numeric: {
      valid: `<input type="text" numeric value="3.14" />`,
      invalid: `<input type="text" numeric value="abc" />`
    },
    digits: {
      valid: `<input type="text" digits="5" value="12345" />`,
      invalid: `<input type="text" digits="5" value="1234" />`
    },
    between: {
      valid: `<input type="number" between="3,10" value="5" />`,
      invalid: `<input type="number" between="3,10" value="11" />`
    }
  }

  for (const [ruleName, rule] of Object.entries(numberRules)) {
    describe(`Rule: ${ruleName}`, () => {
      beforeEach(() => defineRule(ruleName, rule))

      it('passes valid form field', async () => {
        const { field } = createFormField(htmlMap[ruleName].valid)
        const result = await validateField(field)
        expect(result.isValid).toBe(true)
      })

      it('fails invalid form field', async () => {
        const { field } = createFormField(htmlMap[ruleName].invalid)
        const result = await validateField(field)
        expect(result.isValid).toBe(false)
      })
    })
  }
})
