/**
 * @file helpers/parse/formatDate.test.js
 */

import { describe, it, expect } from 'vitest'
import { formatDate } from '../../../src/helpers/format'

describe('formatDate()', () => {
  it('parses an ISO-like string into a valid Date', () => {
    const date = formatDate('2025-10-07')
    expect(date).toBeInstanceOf(Date)
    expect(date.getFullYear()).toBe(2025)
  })

  it('returns null for invalid date strings', () => {
    expect(formatDate('invalid-date')).toBeNull()
  })

  it('returns null for empty, whitespace, or non-string value', () => {
    expect(formatDate('')).toBeNull()
    expect(formatDate('   ')).toBeNull()
    expect(formatDate(12345)).toBeNull()
  })
})
