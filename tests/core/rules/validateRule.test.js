/**
 * @file core/rules/validateRule.test.js
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { defineRule, validateRule, ruleRegistry } from '../../../src/core/rules'
import { createFormField, cleanupDocument } from '../../utils/main'
import { between } from '../../../src/rules'

const htmlMap = {
  inputs: `
    <input type="number" between="5,10" value="6" />
	<input type="number" between="5,10" value="4" />
  `
}

describe('validateRule()', () => {
  let field, field2

  beforeEach(() => {
    ;({ field, field2 } = createFormField(htmlMap.inputs))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('retuns resolved message when validation result is false', async () => {
    defineRule('between', between)

    const result = await validateRule(ruleRegistry['between'], field2)
    expect(result).toBe('Must be between 5 and 10.')
  })

  it('returns undefined when validation result is true', async () => {
    defineRule('between', between)

    const result = await validateRule(ruleRegistry['between'], field)
    expect(result).toBeUndefined()
  })

  it('returns undefined when validation result is null', async () => {
    defineRule('between', {
      ...between,
      validate: () => null
    })

    const result = await validateRule(ruleRegistry['between'], field)
    expect(result).toBeUndefined()
  })

  it('handles thrown errors gracefully', async () => {
    console.error = vi.fn()

    defineRule('between', {
      ...between,
      validate: vi.fn().mockRejectedValue(new Error('fail'))
    })

    await validateRule(ruleRegistry['between'], field)
    expect(console.error).toHaveBeenCalled()
  })
})
