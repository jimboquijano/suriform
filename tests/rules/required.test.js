/**
 * @file rules/required.test.js
 * @description Unit tests for conditional required validation rules.
 *
 * Covers: required-if, required-unless, required-with, required-with-all.
 * Tests scenarios where form fields are conditionally required based on other fields.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { requiredRules } from '../../src/rules'

describe('Required Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  const htmlMap = {
    requiredIf: {
      valid: `
        <input type="text" required-if="target:on" />
        <input type="checkbox" name="target" />
      `,
      invalid: `
        <input type="text" required-if="target:on" />
        <input type="checkbox" name="target" checked />
      `
    },
    requiredUnless: {
      valid: `
        <input type="text" required-unless="target:on" />
        <input type="checkbox" name="target" checked />
      `,
      invalid: `
        <input type="text" required-unless="target:on" />
        <input type="checkbox" name="target" />
      `
    },
    requiredWith: {
      valid: `
        <input type="text" required-with="target" />
        <input type="text" name="target" />
      `,
      invalid: `
        <input type="text" required-with="target" />
        <input type="text" name="target" value="filled" />
      `
    },
    requiredWithAll: {
      valid: `
        <input type="text" required-with-all="target1,target2" />
        <input type="text" name="target1" />
        <input type="text" name="target2" />
      `,
      invalid: `
        <input type="text" required-with-all="target1,target2" />
        <input type="text" name="target1" value="filled"" />
        <input type="text" name="target2" value="filled" />
      `
    }
  }

  for (const [ruleName, rule] of Object.entries(requiredRules)) {
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
