/**
 * @file rules/multi.js
 * @description Validation rules for <select multiple> elements in Suriform forms.
 */

import { formatList } from '../helpers/format'

/**
 * Validate that at least N options are selected.
 * Pass N as the `min-select` property on the rule object.
 * Example: <select multiple min-select="2">
 */
export const minSelect = {
  validate: (value, [minSelect]) => {
    if (minSelect === '') return true
    const min = Number(minSelect) ?? 1
    return value.length >= min
  },
  message: 'Please select at least {num} options.'
}

/**
 * Validate that no more than N options are selected.
 * Pass N as the `max-select` property on the rule object.
 * Example: <select multiple max-select="3">
 */
export const maxSelect = {
  validate: (value, [maxSelect]) => {
    if (maxSelect === '') return true
    const max = Number(maxSelect) ?? Infinity
    return value.length <= max
  },
  message: 'Please select no more than {num} options.'
}

/**
 * Validate that all selected options are in an allowed list.
 * Pass allowed array as `allowed` property on the rule object.
 * Example: <select multiple allowed="red,green,blue">
 */
export const allowed = {
  validate: (value, allowed) => {
    return value.every((v) => allowed.includes(v))
  },
  format: (_, allowed) => {
    return { allowed: formatList(allowed) }
  },
  message: 'Allowed selections: {allowed}.'
}

/**
 * Validate that no selected options are in a forbidden list.
 * Pass forbidden array as `forbidden` property on the rule object.
 * Example: <select multiple forbidden="yellow,pink">
 */
export const forbidden = {
  validate: (value, forbidden) => {
    return !value.some((v) => forbidden.includes(v))
  },
  format: (_, forbidden) => {
    return { forbidden: formatList(forbidden) }
  },
  message: 'Forbidden selections: {forbidden}.'
}

/**
 * Grouped multi-select rules for easy import
 */
export const selectRules = {
  minSelect,
  maxSelect,
  allowed,
  forbidden
}
