/**
 * @file helpers/format/formatList.test.js
 */
import { describe, it, expect } from 'vitest'
import { formatList } from '../../../src/helpers/format'

describe('formatList()', () => {
  it('returns an empty string for an empty array', () => {
    expect(formatList([])).toBe('')
  })

  it('returns a single item without separators', () => {
    expect(formatList(['apple'])).toBe('apple')
  })

  it('joins two items with “and”', () => {
    expect(formatList(['apple', 'banana'])).toBe('apple and banana')
  })

  it('joins three items with commas and “and” before the last item', () => {
    expect(formatList(['apple', 'banana', 'orange'])).toBe('apple, banana, and orange')
  })

  it('formats longer lists with commas and a final “and”', () => {
    expect(formatList(['a', 'b', 'c', 'd'])).toBe('a, b, c, and d')
  })
})
