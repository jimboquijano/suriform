/**
 * @file helpers/format/escapeHtml.test.js
 */
import { describe, it, expect } from 'vitest'
import { escapeHtml } from '../../../src/helpers/format'

describe('escapeHtml()', () => {
  it('escapes common HTML entities correctly', () => {
    expect(escapeHtml(`<div>"O'Reilly" & friends</div>`)).toBe(
      '&lt;div&gt;&quot;O&#39;Reilly&quot; &amp; friends&lt;/div&gt;'
    )
  })

  it('returns unchanged value when no entities are present', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
  })

  it('safely handles numeric value', () => {
    expect(escapeHtml(123)).toBe('123')
  })
})
