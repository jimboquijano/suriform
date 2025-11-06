/**
 * @file rules/string.js
 * @description String validation rules for Suriform forms.
 */

import { formatList } from '../helpers/format'

/**
 * Validate exact string length.
 * Example: <input type="text" length="5" />
 */
export const length = {
  validate: (value, [length]) => value.length === parseInt(length, 10),
  message: 'Must be exactly {length} characters.'
}

/**
 * Validate against a regular expression.
 * Example: <input type="text" regex="^[A-Za-z]+$,i" regex-flags="i" />
 */
export const regex = {
  validate: (value, [pattern, flags]) => new RegExp(pattern, flags).test(value),
  message: 'Invalid regex format.'
}

/**
 * Validate that form field contains a substring.
 * Example: <input type="text" contains="abc" />
 */
export const contains = {
  validate: (value, [substring]) => value.includes(substring),
  message: 'Must contain "{str}".'
}

/**
 * Validate that form field does not contain a substring.
 * Example: <input type="text" not-contains="abc" />
 */
export const notContains = {
  validate: (value, [substring]) => !value.includes(substring),
  message: 'Must not contain "{str}".'
}

/**
 * Validate that form field matches one of the allowed values.
 * Example: <input type="text" one-of="yes,no,maybe" />
 */
export const oneOf = {
  validate: (value, allowed) => {
    return allowed.includes(value)
  },
  format: (_, oneOf) => {
    return { allowed: formatList(oneOf) }
  },
  message: 'Must be one of: {allowed}.'
}

/**
 * Validate that form field does not match forbidden values.
 * Example: <input type="text" not-one-of="admin,root,test" />
 */
export const notOneOf = {
  validate: (value, forbidden) => {
    return !forbidden.includes(value)
  },
  format: (_, notOneOf) => {
    return { forbidden: formatList(notOneOf) }
  },
  message: 'Cannot be: {forbidden}.'
}

/**
 * Validate that form field length is between min and max.
 * Example: <input type="text" between-char="3,10" />
 */
export const betweenChar = {
  validate: (value, [min, max]) => {
    const len = value.length
    return len >= min && len <= max
  },
  format: (_, [min, max]) => {
    return { min, max }
  },
  message: 'Must be between {min} and {max} characters.'
}

/**
 * Validate that a password is strong enough.
 * Example: <input type="password" strong />
 */
export const strong = {
  validate: (value) => {
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumber = /[0-9]/.test(value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
    const isLongEnough = value.length >= 8

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough
  },
  message: 'Password must be 8+ chars, with upper, lower, number & symbol.'
}

/**
 * Grouped string rules for easy import
 */
export const stringRules = {
  length,
  regex,
  contains,
  notContains,
  oneOf,
  notOneOf,
  betweenChar,
  strong
}
