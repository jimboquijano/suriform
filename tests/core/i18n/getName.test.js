/**
 * @file core/i18n/getName.test.js
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { localize, getName, localeRegistry } from '../../../src/core/i18n'

describe('getName()', () => {
  beforeEach(() => {
    localize({
      en: { names: { username: 'Username' } },
      fr: { names: { username: "Nom d'utilisateur" } }
    })
  })

  it('returns the correct localized field name', () => {
    const name = getName('username', 'en')
    const name2 = getName('username', 'fr')

    expect(name).toBe('Username')
    expect(name2).toBe("Nom d'utilisateur")
  })

  it('falls back to "en" when locale is missing', () => {
    const name = getName('username', 'de')
    expect(name).toBe('Username')
  })

  it('falls back to `key` when field name missing', () => {
    const name = getName('missing', 'fr')
    expect(name).toBe('missing')
  })

  it('falls back to `key` when both locale and "en" are missing', () => {
    delete localeRegistry.en
    const message = getName('username', 'es')
    expect(message).toBe('username')
  })
})
