/**
 * @file core/i18n/setLocale.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { setLocale, localize, getMessage } from '../../../src/core/i18n'
import { validateField } from '../../../src/core/validate'
import * as validateModule from '../../../src/core/validate'

const htmlMap = {
  input: '<input type="text" required />'
}

describe('setLocale()', () => {
  let form, form2, field

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.input))
    ;({ form: form2 } = createFormField(htmlMap.input))

    localize({
      en: { messages: { required: 'Required' } },
      fr: { messages: { required: 'Obligatoire' } }
    })
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('sets the global locale when no form is given', () => {
    setLocale('fr')
    expect(getMessage('required')).toBe('Obligatoire')
  })

  it('sets the locale only for a specific form when provided', () => {
    setLocale('fr', form)
    expect(form.__sfLocale).toBe('fr')
  })

  it('revalidates all form fields that have errror', async () => {
    setLocale('en', form)
    await validateField(field)

    const errorEl = field.nextElementSibling
    expect(errorEl.textContent).toBe('Required')

    const spyValidate = vi.spyOn(validateModule, 'validateField')
    await setLocale('fr', form)

    expect(errorEl.textContent).toBe('Obligatoire')
    expect(spyValidate).toHaveBeenCalledTimes(1)
  })

  it('does not affect global locale when setting per-form locale', () => {
    setLocale('en')
    setLocale('fr', form)

    expect(getMessage('required')).toBe('Required')
    expect(form.__sfLocale).toBe('fr')
    expect(form2.__sfLocale).toBeUndefined()
  })
})
