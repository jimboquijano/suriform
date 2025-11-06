/**
 * @file core/rules/defineRules.test.js
 */

import { describe, it, expect, vi } from 'vitest'
import { defineRules, ruleRegistry } from '../../../src/core/rules'

describe('defineRules()', () => {
  it('registers multiple rules from an object', () => {
    defineRules({
      min: { validate: vi.fn() },
      max: { validate: vi.fn() }
    })

    expect(ruleRegistry.min).toBeDefined()
    expect(ruleRegistry.max).toBeDefined()
  })

  it('logs an error when given non-object', () => {
    console.error = vi.fn()
    defineRules(null)
    expect(console.error).toHaveBeenCalled()
  })
})
