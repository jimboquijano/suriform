/**
 * @file core/rules/splitParams.test.js
 */

import { describe, it, expect } from 'vitest'
import { splitParams } from '../../../src/helpers/format'

describe('splitParams()', () => {
  it('returns parsed array for comma-separated values', () => {
    const params = splitParams('5,10,true')
    expect(params).toStrictEqual([5, 10, true])
  })

  it('returns empty array when for null values', () => {
    const params = splitParams(null)
    expect(params).toStrictEqual([])
  })

  it('converts numeric and boolean strings', () => {
    const params = splitParams('true,false,42')
    expect(params).toStrictEqual([true, false, 42])
  })
})
