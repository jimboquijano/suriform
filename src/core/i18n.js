/**
 * @file core/i18n.js
 * @description Locale management and i18n support for Suriform.
 *
 * Provides translation utilities and locale detection for form messages.
 * Supports automatic fallback and placeholder interpolation, ensuring
 * user-friendly validation feedback across multiple languages.
 */

import { retrieveFields, validateField } from './validate'
import { resetResultCache } from './rules'

export let currentLocale
export const localeRegistry = {}

/**
 * Registers multiple locales into the global registry.
 *
 * 1. Iterate over each locale code and corresponding messages or generators.
 * 2. Initialize an empty registry entry if the locale does not exist.
 * 3. Merge provided messages into the locale entry, handling errors gracefully.
 *
 * @param {Record<string,Record<string,string>|Function>} locales - Map of locale codes to messages or generators.
 */
export function localize(locales) {
  for (const [locale, source] of Object.entries(locales)) {
    // Skip invalid entries (must be non-null objects)
    if (typeof source !== 'object' || !source) {
      console.error(`[SF] Invalid locale source:`, locale)
      continue
    }

    // Initialize or reuse existing locale registry entry
    const target = (localeRegistry[locale] ??= {})

    // Merge each key (e.g. messages, names, dateFormats, etc.)
    for (const [key, value] of Object.entries(source)) {
      if (isPlainObject(value) && isPlainObject(target[key])) {
        Object.assign(target[key], value)
      } else {
        target[key] = value
      }
    }
  }

  // Set initial locale
  if (!currentLocale) {
    currentLocale = initLocale()
  }

  /**
   * Checks if a value is a non-null plain object (not array or function).
   *
   * @param {any} obj - The value to check.
   * @returns {boolean} True if plain object.
   */
  function isPlainObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj)
  }
}

/**
 * Automatically initialize the locale from document attributes.
 *
 * 1. Detect the <html lang> attribute.
 * 2. Default to 'en' if no attribute is found.
 * 3. Return the resolved locale code.
 *
 * @returns {string} The resolved locale code.
 */
export function initLocale() {
  const htmlLang = document.documentElement.getAttribute('lang')
  return htmlLang || 'en'
}

/**
 * Set the locale globally or for a specific form.
 *
 * 1. Resets the results cache that holds previous localized message.
 * 2. If a form element is provided, store the locale on the form object.
 * 3. Then revalidate all active or invalid fields of the given form.
 * 4. Otherwise, update the global currentLocale which apply to all forms.
 *
 * @param {string} locale - Locale code to set.
 * @param {HTMLFormElement} [form] - Optional form to assign locale to.
 */
export async function setLocale(locale, form) {
  resetResultCache()

  if (form instanceof HTMLFormElement) {
    form.__sfLocale = locale

    // Run validation for each active field
    for (const field of retrieveFields(form)) {
      if (!field.hasAttribute('aria-describedby')) continue
      await validateField(field)
    }
  } else {
    currentLocale = locale
  }
}

/**
 * Retrieve a localized value from the registry.
 *
 * 1. Determine the effective locale (formLocale or global currentLocale).
 * 2. Retrieve the type-specific locale data (messages or names).
 * 3. Return the value if found; otherwise, fallback to the default value.
 *
 * @param {'messages'|'names'} type - Lookup type.
 * @param {string} key - Key to look up.
 * @param {string} [formLocale] - Optional locale code.
 * @param {string} [defaultValue] - Value to return if key is missing.
 * @returns {string} The localized value or fallback.
 */
export function getLocaleValue(type, key, formLocale, defaultValue) {
  const locale = formLocale || currentLocale
  const localeData = localeRegistry[locale] || localeRegistry['en']

  if (!localeData || !localeData[type]) {
    return defaultValue
  }

  // If theres any result, return it
  const result = localeData[type][key]
  if (typeof result === 'string') {
    return result
  }

  return defaultValue
}

/**
 * Retrieve a localized message by key and optional locale.
 *
 * 1. Look up the key in the messages registry using getLocaleValue.
 * 2. Fallback to currentLocale, then 'en', then the key itself.
 *
 * @param {string} key - Message key.
 * @param {string} [locale] - Optional locale code.
 * @returns {string} The localized message or fallback.
 */
export function getMessage(key, locale) {
  return getLocaleValue('messages', key, locale, key)
}

/**
 * Retrieve a localized field name by key and optional locale.
 *
 * 1. Look up the key in the names registry using getLocaleValue.
 * 2. Fallback to currentLocale, then 'en', then the key itself.
 *
 * @param {string} key - Field key.
 * @param {string} [locale] - Optional locale code.
 * @returns {string} The localized field name or fallback.
 */
export function getName(key, locale) {
  return getLocaleValue('names', key, locale, key)
}

/**
 * Interpolate a message template with key-value pairs.
 *
 * 1. Replace the {field} token using getFormattedField if available.
 * 2. Replace other tokens using the provided keyValue object.
 * 3. Leave unmatched tokens unchanged.
 *
 * @param {string} message - Template with tokens like {token}.
 * @param {string} field - Field name for {field} replacement.
 * @param {Object} keyValue - Key-value pairs for other token replacements.
 * @returns {string} Interpolated message.
 */
export function formatKeyValue(message, field, keyValue = {}) {
  if (typeof message !== 'string') return ''

  return message.replace(/\{(\w+)\}/g, (match, token) => {
    if (token === 'field' && field) {
      return field
    }

    if (Object.prototype.hasOwnProperty.call(keyValue, token)) {
      return keyValue[token]
    }

    // If token not found, leave it unchanged
    return match
  })
}

/**
 * Interpolate a message template with positional parameters.
 *
 * 1. Prepare a reversed queue of params for fallback use.
 * 2. Replace the {field} token with the field name.
 * 3. Replace tokens using format index or fallback queue.
 *
 * @param {string} message - Template with tokens like {token}.
 * @param {string} field - Field name for {field} replacement.
 * @param {Array<any>} params - Positional parameters.
 * @param {Array<string>} format - Optional names for tokens corresponding to params.
 * @returns {string} Interpolated message.
 */
export function formatPositional(message, field, params = [], format = []) {
  if (typeof message !== 'string') return ''

  // Copy and reverse for O(1) pop
  const paramQueue = [...params].reverse()

  return message.replace(/\{(\w+)\}/g, (_, token) => {
    if (token === 'field') {
      return field != null ? field : ''
    }

    const index = format.indexOf(token)
    if (index !== -1 && index < params.length) {
      return params[index]
    }

    // Fallback from reversed queue
    return paramQueue.pop() ?? ''
  })
}
