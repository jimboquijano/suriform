/**
 * @file core/i18n/formatPositional.test.js
 */

import { describe, it, expect } from 'vitest'
import { formatPositional } from '../../../src/core/i18n'

const messageMap = {
  complete: 'Hello {dad}, {mom} and {son}',
  unknown: 'Hello {mom} {unknown}',
  field: 'Please enter {field}'
}

const paramsFormat = ['Jim', 'Jen', 'James']
const namesFormat = ['dad', 'mom', 'son']

describe('formatPositional()', () => {
  it('replaces tokens using positional params', () => {
    const message = formatPositional(messageMap.complete, '', paramsFormat)
    expect(message).toBe('Hello Jim, Jen and James')
  })

  it('replaces tokens using positional params and names', () => {
    const message = formatPositional(messageMap.complete, '', paramsFormat, namesFormat)
    expect(message).toBe('Hello Jim, Jen and James')
  })

  it('replaces {field} token with field name', () => {
    const message = formatPositional(messageMap.field, 'Email', [])
    expect(message).toBe('Please enter Email')
  })

  it('returns empty string for unknown tokens', () => {
    const message = formatPositional(messageMap.unknown, '', paramsFormat, [])
    expect(message).toBe('Hello Jim Jen')
  })

  it('returns empty string for non-string templates', () => {
    expect(formatPositional('', '', [], [])).toBe('')
    expect(formatPositional(null, '', [], [])).toBe('')
  })
})
