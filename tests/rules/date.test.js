/**
 * @file rules/date.test.js
 * @description Unit tests for date-related validation rules.
 *
 * Covers: date-before, date-after, date-between, min-date, max-date.
 * Ensures proper handling of date strings and reference fields.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { dateRules } from '../../src/rules/date'

describe('Date Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  const htmlMap = {
    dateBefore: {
      valid: `
        <input type="date" date-before="target" value="2025-10-14" />
        <input type="date" name="target" value="2025-10-15" />
      `,
      invalid: `
        <input type="date" date-before="target" value="2025-10-14" />
        <input type="date" name="target" value="2025-10-13" />
      `
    },
    dateAfter: {
      valid: `
        <input type="date" date-after="target" value="2025-10-14" />
        <input type="date" name="target" value="2025-10-13" />
      `,
      invalid: `
        <input type="date" date-after="target" value="2025-10-14" />
        <input type="date" name="target" value="2025-10-15" />
      `
    },
    dateBetween: {
      valid: `<input type="date" date-between="2025-10-01,2025-10-31" value="2025-10-14" />`,
      invalid: `<input type="date" date-between="2025-10-01,2025-10-10" value="2025-10-14" />`
    },
    minDate: {
      valid: `<input type="date" min-date="2025-10-01" value="2025-10-14" />`,
      invalid: `<input type="date" min-date="2025-10-15" value="2025-10-14" />`
    },
    maxDate: {
      valid: `<input type="date" max-date="2025-10-31" value="2025-10-14" />`,
      invalid: `<input type="date" max-date="2025-10-10" value="2025-10-14" />`
    }
  }

  for (const [ruleName, rule] of Object.entries(dateRules)) {
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
