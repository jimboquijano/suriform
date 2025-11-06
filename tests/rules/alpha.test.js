/**
 * @file rules/alpha.test.js
 * @description Unit tests for all alpha-related validation rules in Suriform.
 *
 * Covers: alpha, alpha-dash, alpha-num, alpha-spaces, alpha-num-spaces.
 * Verifies both valid and invalid form field scenarios.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { alphaRules } from '../../src/rules'

describe('Alpha Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  const htmlMap = {
    alpha: {
      valid: `<input type="text" alpha value="abcXYZ" />`,
      invalid: `<input type="text" alpha value="abc123" />`
    },
    alphaDash: {
      valid: `<input type="text" alpha-dash value="abc-XYZ_" />`,
      invalid: `<input type="text" alpha-dash value="abc$123" />`
    },
    alphaNum: {
      valid: `<input type="text" alpha-num value="abc123" />`,
      invalid: `<input type="text" alpha-num value="abc$" />`
    },
    alphaSpaces: {
      valid: `<input type="text" alpha-spaces value="abc XYZ" />`,
      invalid: `<input type="text" alpha-spaces value="abc123" />`
    },
    alphaNumSpaces: {
      valid: `<input type="text" alpha-num-spaces value="abc 123" />`,
      invalid: `<input type="text" alpha-num-spaces value="abc$123" />`
    }
  }

  for (const [ruleName, rule] of Object.entries(alphaRules)) {
    describe(`Rule: ${ruleName}`, () => {
      beforeEach(() => defineRule(ruleName, rule))

      it('passes for valid form field', async () => {
        const { field } = createFormField(htmlMap[ruleName].valid)
        const result = await validateField(field)
        expect(result.isValid).toBe(true)
      })

      it('fails for invalid form field', async () => {
        const { field } = createFormField(htmlMap[ruleName].invalid)
        const result = await validateField(field)
        expect(result.isValid).toBe(false)
      })
    })
  }
})
