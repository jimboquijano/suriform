/**
 * @file core/rules/ruleCache.test.js
 */

import { describe, it, expect } from 'vitest'
import { createFormField } from '../../utils/main'
import { defineRule, getRuleCache, resetRuleCache, ruleCache } from '../../../src/core/rules'

const htmlMap = {
  min: '<input type="text" min="5" />'
}

describe('getRuleCache()', () => {
  it('caches rules per field', () => {
    const { field } = createFormField(htmlMap.min)
    defineRule('min', { validate: () => true })

    const first = getRuleCache(field)
    const second = getRuleCache(field)
    expect(first).toBe(second)
  })
})

describe('resetRuleCache()', () => {
  it('resets the WeakMap cache', () => {
    const old = ruleCache
    resetRuleCache()
    expect(ruleCache).not.toBe(old)
  })
})
