/**
 * @file core/rules/resolveMessage.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { resolveMessage } from '../../../src/core/rules'
import { localize, setLocale } from '../../../src/core/i18n'
import { required } from '../../../src/rules/native'

const htmlMap = {
  input: '<input type="text" />'
}

const mockMissing = {
  name: 'missing',
  message: 'Missing'
}

describe('resolveMessage()', () => {
  let form, field

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.input))

    localize({
      en: { messages: { required: 'Required' } },
      fr: { messages: { required: 'Obligatoire' } }
    })
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('returns localized message when available', () => {
    setLocale('fr')
    const message = resolveMessage('required', field, required)
    expect(message).toBe('Obligatoire')
  })

  it('uses group-level override if provided', () => {
    form.__sfMessage = {
      group: vi.fn().mockReturnValue({
        message: 'Custom message'
      })
    }

    setLocale('es')
    const message = resolveMessage('required', field, required)
    expect(message).toStrictEqual({ message: 'Custom message' })
  })

  it('falls back to "en" when locale is missing', () => {
    setLocale('de')
    const message = resolveMessage('required', field, required)
    expect(message).toBe('Required')
  })

  it('falls back to rule message when localize message is missing', () => {
    setLocale('en')
    const message = resolveMessage('missing', field, mockMissing)
    expect(message).toBe('Missing')
  })

  it('falls back to default message when both rule and localize message are missing', () => {
    setLocale('en')
    mockMissing.message = false
    const message = resolveMessage('missing', field, mockMissing)
    expect(message).toBe('The {field} field is invalid.')
  })
})
