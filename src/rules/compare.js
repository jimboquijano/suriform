/**
 * @file rules/compare.js
 * @description Comparison validation rules for Suriform forms.
 */

/**
 * Validate that form field is match with value.
 * Example: <input type="text" equal="5" />
 */
export const match = {
  validate: (value, [str]) => value == str,
  message: 'Value must match {str}.'
}

/**
 * Validate that form field is not match with value.
 * Example: <input type="text" unmatch="5" />
 */
export const unmatch = {
  validate: (value, [str]) => value != str,
  message: 'Value must not match {str}.'
}

/**
 * Validate that form field is greater than value.
 * Example: <input type="number" greater="5" />
 */
export const greater = {
  validate: (value, [num], { type }) => {
    if (isInvalid(type, num)) return true
    return Number(value) > Number(num)
  },
  message: 'Must be greater than {num}.'
}

/**
 * Validate that form field is less than value.
 * Example: <input type="number" less="5" />
 */
export const less = {
  validate: (value, [num], { type }) => {
    if (isInvalid(type, num)) return true
    return Number(value) < Number(num)
  },
  message: 'Must be less than {num}.'
}

/**
 * Validate that two passwords are matched.
 * Example: <input type="text" confirm="password2" />
 */
export const confirm = {
  validate: (value, [target], { form }) => {
    return value == form[target]
  },
  checksTarget: true,
  message: 'Passwords do not match.'
}

/**
 * Validate that form field is match with a target field's value.
 * Example: <input type="text" match-with="targetField" />
 */
export const matchWith = {
  validate: (value, [target], { form }) => {
    return value == form[target]
  },
  format: (_, [target], { form }) => {
    return { str: form[target] }
  },
  checksTarget: true,
  message: 'Value must match {str}.'
}

/**
 * Validate that form field is not match with a target field's value.
 * Example: <input type="text" unmatch-with="targetField" />
 */
export const unmatchWith = {
  validate: (value, [target], { form }) => {
    return value != form[target]
  },
  format: (_, [target], { form }) => {
    return { str: form[target] }
  },
  checksTarget: true,
  message: 'Value must not match {str}.'
}

/**
 * Validate that form field is greater than a target field's value.
 * Example: <input type="number" greater-than="targetField" />
 */
export const greaterThan = {
  validate: (value, [target], { form, type }) => {
    if (isValidTarget(form, type, target)) return true
    return Number(value) > Number(form[target])
  },
  format: (_, [target], { form }) => {
    return { num: form[target] }
  },
  checksTarget: true,
  message: 'Must be greater than {num}.'
}

/**
 * Validate that form field is less than a target field's value.
 * Example: <input type="number" less-than="targetField" />
 */
export const lessThan = {
  validate: (value, [target], { form, type }) => {
    if (isValidTarget(form, type, target)) return true
    return Number(value) < Number(form[target])
  },
  format: (_, [target], { form }) => {
    return { num: form[target] }
  },
  checksTarget: true,
  message: 'Must be less than {num}.'
}

/**
 * Validate that form field is greater than or equal to a target field's value.
 * Example: <input type="number" greater-equal="targetField" />
 */
export const greaterEqual = {
  validate: (value, [target], { form, type }) => {
    if (isValidTarget(form, type, target)) return true
    return Number(value) >= Number(form[target])
  },
  format: (_, [target], { form }) => {
    return { num: form[target] }
  },
  checksTarget: true,
  message: 'Must be greater than or equal to {num}.'
}

/**
 * Validate that form field is less than or equal to a target field's value.
 * Example: <input type="number" less-equal="targetField" />
 */
export const lessEqual = {
  validate: (value, [target], { form, type }) => {
    if (isValidTarget(form, type, target)) return true
    return Number(value) <= Number(form[target])
  },
  format: (_, [target], { form }) => {
    return { num: form[target] }
  },
  checksTarget: true,
  message: 'Must be less than or equal to {num}.'
}

const isInvalid = (type, num) => {
  return type !== 'number' || num === ''
}

const isValidTarget = (form, type, target) => {
  return type !== 'number' || form[target] === ''
}

/**
 * Grouped comparison rules for easy import
 */
export const compareRules = {
  match,
  unmatch,
  greater,
  less,
  confirm,
  matchWith,
  unmatchWith,
  greaterThan,
  lessThan,
  greaterEqual,
  lessEqual
}
