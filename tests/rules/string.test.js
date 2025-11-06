/**
 * @file rules/string.test.js
 * @description Unit tests for string-related validation rules.
 *
 * Covers: length, regex, contains, not-contains, one-of, not-one-of, between-char.
 * Verifies both valid and invalid string form fields.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { stringRules } from '../../src/rules'

describe('String Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  const htmlMap = {
    length: {
      valid: `<input type="text" length="5" value="abcde" />`,
      invalid: `<input type="text" length="5" value="abcd" />`
    },
    regex: {
      valid: `<input type="text" regex="^[A-Za-z]+$" value="hello" />`,
      invalid: `<input type="text" regex="^[A-Za-z]+$" value="hello123" />`
    },
    contains: {
      valid: `<input type="text" contains="abc" value="123abc456" />`,
      invalid: `<input type="text" contains="abc" value="123" />`
    },
    notContains: {
      valid: `<input type="text" not-contains="xyz" value="hello" />`,
      invalid: `<input type="text" not-contains="abc" value="123abc456" />`
    },
    oneOf: {
      valid: `<input type="text" one-of="yes,no,maybe" value="yes" />`,
      invalid: `<input type="text" one-of="yes,no,maybe" value="hello" />`
    },
    notOneOf: {
      valid: `<input type="text" not-one-of="admin,root" value="user" />`,
      invalid: `<input type="text" not-one-of="admin,root" value="admin" />`
    },
    betweenChar: {
      valid: `<input type="text" between-char="3,8" value="abcdef" />`,
      invalid: `<input type="text" between-char="3,5" value="ab" />`
    },
    strong: {
      valid: `<input type="password" strong value="Abcdef1!" />`,
      invalid: `<input type="password" strong value="abc123" />`
    }
  }

  for (const [ruleName, rule] of Object.entries(stringRules)) {
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
