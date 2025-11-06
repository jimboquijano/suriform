/**
 * @file core/i18n/initLocale.test.js
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { initLocale } from '../../../src/core/i18n'

describe('initLocale()', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('lang')
  })

  it('returns the document <html> lang attribute if present', () => {
    document.documentElement.setAttribute('lang', 'fr')
    expect(initLocale()).toBe('fr')
  })

  it('defaults to "en" if no lang attribute is present', () => {
    expect(initLocale()).toBe('en')
  })
})
