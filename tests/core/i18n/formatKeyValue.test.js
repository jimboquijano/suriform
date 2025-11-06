/**
 * @file core/i18n/formatKeyValue.test.js
 */

import { describe, it, expect } from 'vitest'
import { formatKeyValue } from '../../../src/core/i18n'

const messageMap = {
  complete: 'Hello {dad}, {mom} and {son}',
  unknown: 'Hello {mom} {unknown}',
  field: 'Please enter {field}'
}

const messageFormat = {
  dad: 'Jim',
  mom: 'Jen',
  son: 'James'
}

describe('formatKeyValue()', () => {
  it('replaces tokens using key-pair values', () => {
    const message = formatKeyValue(messageMap.complete, '', messageFormat)
    expect(message).toBe('Hello Jim, Jen and James')
  })

  it('replaces {field} token with field name', () => {
    const message = formatKeyValue(messageMap.field, 'Email')
    expect(message).toBe('Please enter Email')
  })

  it('leaves unknown tokens intact', () => {
    const message = formatKeyValue(messageMap.unknown, '', messageFormat)
    expect(message).toBe('Hello Jen {unknown}')
  })

  it('returns empty string for non-string templates', () => {
    expect(formatKeyValue('', '', {})).toBe('')
    expect(formatKeyValue(null, '', {})).toBe('')
  })
})
