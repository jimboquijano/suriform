/**
 * @file rules/native.js
 * @description Native HTML5 validation rules reimplemented for Suriform.
 *
 * Mirrors built-in browser constraint checks such as:
 *   - type="email", type="url", type="number"
 *   - min, max, minlength, maxlength, pattern, step
 *
 * These allow Suriform to replicate browser behavior even with `novalidate` enabled.
 */

import { hasFieldValue } from '../helpers/dom'

/**
 * Validate required form field.
 * Example: <input required />
 */
export const required = {
  name: 'required',
  validate: (value) => {
    return hasFieldValue(value)
  },
  message: 'This field is required.'
}

/**
 * Validate email address.
 * Example: <input type="email" />
 */
export const email = {
  type: 'email',
  validate: (value) => {
    // Simplified but RFC-compliant-enough email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },
  message: 'Please enter an email address.'
}

/**
 * Validate URL format.
 * Example: <input type="url" />
 */
export const url = {
  type: 'url',
  validate: (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  message: 'Please enter a URL.'
}

/**
 * Validate minimum value.
 * Example: <input type="number" min="5" />
 */
export const min = {
  validate: (value, [min], { type }) => {
    if (isValid(type, min)) return true
    const val = Number(value)
    return isNaN(val) ? true : val >= Number(min)
  },
  message: 'Value must be greater than or equal to {min}.'
}

/**
 * Validate maximum value.
 * Example: <input type="number" max="10" />
 */
export const max = {
  validate: (value, [max], { type }) => {
    if (isValid(type, max)) return true
    const val = Number(value)
    return isNaN(val) ? true : val <= Number(max)
  },
  message: 'Value must be less than or equal to {max}.'
}

/**
 * Validate minimum value.
 * Example: <input type="number" step="5" />
 */
export const step = {
  validate: (value, [step], { type }) => {
    if (isValid(type, step)) return true
    return step === 'any' || Number(value) % Number(step) === 0
  },
  format: (value) => {
    const prev = Number(value) - 1
    const next = Number(value) + 1
    return { prev, next }
  },
  message: 'Please enter a valid value. The two nearest valid values are {prev} and {next}.'
}

/**
 * Validate minimum text length.
 * Example: <input minlength="3" />
 */
export const minlength = {
  validate: (value, [minlength]) => {
    if (minlength === null) return true
    return value.length >= Number(minlength)
  },
  format: (value, [minlength]) => {
    return {
      minlength,
      curLength: value.length
    }
  },
  message:
    'Please lengthen this text to {minlength} characters or more (you are currently using {curLength} characters).'
}

/**
 * Validate maximum text length.
 * Example: <input maxlength="10" />
 */
export const maxlength = {
  validate: (value, [maxlength]) => {
    if (maxlength === null) return true
    return value.length <= Number(maxlength)
  },
  format: (value, [maxlength]) => {
    return {
      maxlength,
      curLength: value.length
    }
  },
  message:
    'Please shorten this text to no more than {maxlength} characters (you are currently using {curLength} characters).'
}

/**
 * Validate pattern attribute using RegExp.
 * Example: <input pattern="^[A-Z]{3}$" />
 */
export const pattern = {
  validate: (value, [pattern]) => {
    if (!pattern || value === '') return true

    try {
      const regex = new RegExp(`^(?:${pattern})$`)
      return regex.test(value)
    } catch {
      return true // ignore invalid regex
    }
  },
  message: 'Please match the requested format.'
}

const isValid = (type, val) => {
  return type !== 'number' || val === ''
}

/**
 * Grouped native rules for easy import
 * NOTE: The required rule is called directly inside core
 */
export const nativeRules = {
  email,
  url,
  min,
  max,
  step,
  minlength,
  maxlength,
  pattern
}
