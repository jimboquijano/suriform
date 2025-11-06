/**
 * @file rules/native.test.js
 * @description Unit tests for HTML5 native validation rules.
 *
 * Covers: required, email, url, min, max, minlength, maxlength, pattern.
 * Skips 'range' due to jsdom limitations.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { nativeRules } from '../../src/rules'

const htmlMap = {
  required: {
    valid: `<input type="text" required value="Hello" />`,
    invalid: `<input type="text" required value="" />`
  },
  email: {
    valid: `<input type="email" value="user@example.com" />`,
    invalid: `<input type="email" value="not-an-email" />`
  },
  url: {
    valid: `<input type="url" value="https://example.com" />`,
    invalid: `<input type="url" value="not_a_url" />`
  },
  min: {
    valid: `<input type="number" min="5" value="10" />`,
    invalid: `<input type="number" min="5" value="2" />`
  },
  max: {
    valid: `<input type="number" max="10" value="5" />`,
    invalid: `<input type="number" max="10" value="15" />`
  },
  step: {
    valid: `<input type="number" step="2" value="4" />`,
    invalid: `<input type="number" step="2" value="5" />`
  },
  minlength: {
    valid: `<input type="text" minlength="3" value="abcd" />`,
    invalid: `<input type="text" minlength="5" value="abc" />`
  },
  maxlength: {
    valid: `<input type="text" maxlength="10" value="short" />`,
    invalid: `<input type="text" maxlength="5" value="toolongtext" />`
  },
  pattern: {
    valid: `<input type="text" pattern="[A-Z]{3}" value="ABC" />`,
    invalid: `<input type="text" pattern="[A-Z]{3}" value="abc" />`
  }
}

describe('Native Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  for (const [ruleName, rule] of Object.entries(nativeRules)) {
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
