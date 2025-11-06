/**
 * @file rules/compare.test.js
 * @description Unit tests for compare validation rules.
 *
 * Covers: match, unmatch, greater, less, greater-equal, less-equal.
 * Validates direct value comparisons.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { compareRules } from '../../src/rules'

describe('Compare Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  const htmlMap = {
    match: {
      valid: `<input type="number" match="10" value="10" />`,
      invalid: `<input type="number" match="5" value="10" />`
    },
    unmatch: {
      valid: `<input type="number" unmatch="10" value="5" />`,
      invalid: `<input type="number" unmatch="5" value="5" />`
    },
    greater: {
      valid: `<input type="number" greater="5" value="10" />`,
      invalid: `<input type="number" greater="5" value="3" />`
    },
    less: {
      valid: `<input type="number" less="10" value="5" />`,
      invalid: `<input type="number" less="5" value="10" />`
    },
    confirm: {
      valid: `
        <input type="password" confirm="target" value="10" />
        <input type="password" name="target" value="10" />
      `,
      invalid: `
        <input type="password" confirm="target" value="10" />
        <input type="password" name="target" value="5" />
      `
    },
    matchWith: {
      valid: `
        <input type="text" match-with="target" value="10" />
        <input type="text" name="target" value="10" />
      `,
      invalid: `
        <input type="text" match-with="target" value="10" />
        <input type="text" name="target" value="5" />
      `
    },
    unmatchWith: {
      valid: `
        <input type="text" unmatch-with="target" value="5" />
        <input type="text" name="target" value="10" />
      `,
      invalid: `
        <input type="text" unmatch-with="target" value="5" />
        <input type="text" name="target" value="5" />
      `
    },
    greaterThan: {
      valid: `
        <input type="number" greater-than="target" value="10" />
        <input type="number" name="target" value="5" />
      `,
      invalid: `
        <input type="number" greater-than="@target" value="3" />
        <input type="number" name="target" value="5" />
      `
    },
    lessThan: {
      valid: `
        <input type="number" less-than="target" value="5" />
        <input type="number" name="target" value="10" />
      `,
      invalid: `
        <input type="number" less-than="target" value="10" />
        <input type="number" name="target" value="5" />
      `
    },
    greaterEqual: {
      valid: `
        <input type="number" greater-equal="target" value="10" />
        <input type="number" name="target" value="10" />
      `,
      invalid: `
        <input type="number" greater-equal="target" value="4" />
        <input type="number" name="target" value="5" />
      `
    },
    lessEqual: {
      valid: `
        <input type="number" less-equal="target" value="5" />
        <input type="number" name="target" value="5" />
      `,
      invalid: `
        <input type="number" less-equal="target" value="6" />
        <input type="number" name="target" value="5" />
      `
    }
  }

  for (const [ruleName, rule] of Object.entries(compareRules)) {
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
