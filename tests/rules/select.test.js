/**
 * @file rules/select.test.js
 * @description Unit tests for select validation rules.
 *
 * Covers: min-select, max-select, allowed, forbidden.
 * Verifies both valid and invalid select form fields.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { selectRules } from '../../src/rules'

describe('Select Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  const htmlMap = {
    minSelect: {
      valid: `
	    <select multiple min-select="2">
          <option value="a" selected>a</option>
          <option value="b" selected>b</option>
        </select>
	  `,
      invalid: `
	    <select multiple min-select="2">
          <option value="a" selected>a</option>
          <option value="b">b</option>
        </select>
	  `
    },
    maxSelect: {
      valid: `
	    <select multiple max-select="2">
		  <option value="a" selected>a</option>
		  <option value="b" selected>b</option>
		</select>
	  `,
      invalid: `
	    <select multiple max-select="2">
		  <option value="a" selected>a</option>
		  <option value="b" selected>b</option>
		  <option value="c" selected>c</option>
		</select>
	  `
    },
    allowed: {
      valid: `
	    <select multiple allowed="red,green,blue">
          <option value="red" selected>red</option>
          <option value="green" selected>green</option>
        </select>
	  `,
      invalid: `
	    <select multiple allowed="red,green,blue">
		  <option value="red" selected>red</option>
		  <option value="yellow" selected>yellow</option>
		</select>
	  `
    },
    forbidden: {
      valid: `
	    <select multiple forbidden="yellow,pink">
		  <option value="red" selected>red</option>
		  <option value="green" selected>green</option>
	   </select>
	  `,
      invalid: `
	    <select multiple forbidden="yellow,pink">
		  <option value="red" selected>red</option>
		  <option value="yellow" selected>yellow</option>
		</select>
	  `
    }
  }

  for (const [ruleName, rule] of Object.entries(selectRules)) {
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
