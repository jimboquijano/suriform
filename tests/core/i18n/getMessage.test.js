/**
 * @file core/i18n/getMessage.test.js
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { localize, getMessage, localeRegistry } from '../../../src/core/i18n'

describe('core/i18n/getMessage', () => {
  beforeEach(() => {
    localize({
      en: { messages: { required: 'Required' } },
      fr: { messages: { required: 'Obligatoire' } }
    })
  })

  it('returns the correct localized message', () => {
    const message = getMessage('required', 'en')
    const message2 = getMessage('required', 'fr')

    expect(message).toBe('Required')
    expect(message2).toBe('Obligatoire')
  })

  it('falls back to "en" when locale is missing', () => {
    const message = getMessage('required', 'de')
    expect(message).toBe('Required')
  })

  it('falls back to `key` when message is missing', () => {
    const message = getMessage('missing', 'fr')
    expect(message).toBe('missing')
  })

  it('falls back to `key` when both locale and "en" are missing', () => {
    delete localeRegistry.en
    const message = getMessage('required', 'es')
    expect(message).toBe('required')
  })
})
