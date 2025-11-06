/**
 * @file core/i18n/localize.test.js
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { localize, getMessage, getName, localeRegistry } from '../../../src/core/i18n'

describe('localize()', () => {
  beforeEach(() => {
    for (const key in localeRegistry) delete localeRegistry[key]
  })

  it('registers locale sources for a single locale', () => {
    localize({ fr: { messages: { required: 'Champ requis.' } } })
    expect(localeRegistry.fr.messages.required).toBe('Champ requis.')
  })

  it('registers locale sources for a multiple locale', () => {
    localize({
      en: { messages: { required: 'Required' } },
      fr: { messages: { required: 'Obligatoire' } }
    })

    expect(localeRegistry.en.messages.required).toBe('Required')
    expect(localeRegistry.fr.messages.required).toBe('Obligatoire')
  })

  it('merges locale sources when called multiple times', () => {
    localize({
      fr: { messages: { required: 'Obligatoire' } }
    })

    localize({
      fr: { messages: { min: 'Trop court.' } }
    })

    expect(localeRegistry.fr.messages).toMatchObject({
      required: 'Obligatoire',
      min: 'Trop court.'
    })
  })

  it('handles invalid locale sources gracefully', () => {
    const spy = vi.spyOn(console, 'error')
    localize({ xx: null })

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('returns correct messages per locale using `getMessage`', () => {
    localize({
      fr: { messages: { required: 'Obligatoire' } },
      es: { messages: { required: 'Requerido' } }
    })

    expect(getMessage('required', 'fr')).toBe('Obligatoire')
    expect(getMessage('required', 'es')).toBe('Requerido')
  })

  it('returns correct names per locale using `getName`', () => {
    localize({
      en: { names: { username: 'Username' } },
      fr: { names: { username: "Nom d'utilisateur" } }
    })

    expect(getName('username', 'en')).toBe('Username')
    expect(getName('username', 'fr')).toBe("Nom d'utilisateur")
  })

  it('falls back to "en" when locale is missing', () => {
    localize({
      en: { messages: { required: 'Required' } },
      fr: { messages: { required: 'Obligatoire' } },
      es: { messages: { required: 'Requerido' } }
    })

    expect(getMessage('required', 'de')).toBe('Required')
  })

  it('falls back to `key` when locale is missing', () => {
    localize({
      fr: { messages: { required: 'Obligatoire' } },
      es: { messages: { required: 'Requerido' } }
    })

    expect(getMessage('required', 'de')).toBe('required')
  })
})
