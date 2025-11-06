/**
 * @file core/rules/defineRule.test.js
 */

import { describe, it, expect, vi } from 'vitest'
import { defineRule, ruleRegistry, reqRegistry } from '../../../src/core/rules'

describe('defineRule()', () => {
  it('registers a standard rule correctly', () => {
    const validate = vi.fn()
    defineRule('min', { validate })
    const stored = ruleRegistry['min']

    expect(stored).toBeDefined()
    expect(stored.name).toBe('min')
    expect(stored.attr).toBe('min')
    expect(stored.validate).toBe(validate)
  })

  it('registers a required rule when `checksRequired` is true', () => {
    const validate = vi.fn()
    defineRule('required-if', { validate, checksRequired: true })
    const stored = reqRegistry['required-if']

    expect(stored).toBeDefined()
    expect(stored.name).toBe('required-if')
    expect(stored.validate).toBe(validate)
  })

  it('normalizes rule attribute from camelCase to kebab-case', () => {
    const validate = vi.fn()
    defineRule('alphaDash', { validate })

    const stored = ruleRegistry['alpha-dash']
    expect(stored.attr).toBe('alpha-dash')
  })

  it('logs an error for invalid rule', () => {
    console.error = vi.fn()
    defineRule('', { validate: 'bad' })

    expect(console.error).toHaveBeenCalled()
  })
})
