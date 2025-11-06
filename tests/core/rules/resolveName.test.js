/**
 * @file core/rules/resolveName.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { resolveName } from '../../../src/core/rules'
import { localize, setLocale } from '../../../src/core/i18n'

const htmlMap = {
  input: '<input type="text" />'
}

describe('resolveName()', () => {
  let field

  beforeEach(() => {
    ;({ field } = createFormField(htmlMap.input))

    localize({
      en: { names: { username: 'Username' } },
      fr: { names: { username: "Nom d'utilisateur" } }
    })
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('returns localized name when available', () => {
    setLocale('fr')
    field.name = 'username'

    const message = resolveName(field)
    expect(message).toBe("Nom d'utilisateur")
  })

  it('falls back to aria-label when field has no name', () => {
    field.setAttribute('aria-label', 'Email')
    const result = resolveName(field)
    expect(result).toBe('Email')
  })

  it('falls back to ID when field has no name', () => {
    field.setAttribute('id', 'Email')
    const result = resolveName(field)
    expect(result).toBe('Email')
  })

  it('falls back to "en" when locale is missing', () => {
    setLocale('de')
    field.name = 'username'

    const message = resolveName(field)
    expect(message).toBe('Username')
  })

  it('falls back to `key` when name is missing', () => {
    setLocale('en')
    field.name = 'missing'

    const message = resolveName(field)
    expect(message).toBe('Missing')
  })

  it('falls back to `key` when both locale and "en" are missing', () => {
    setLocale('de')
    field.name = 'missing'

    const message = resolveName(field)
    expect(message).toBe('Missing')
  })
})
