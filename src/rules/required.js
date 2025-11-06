/**
 * @file rules/required.js
 * @description Required validation rules for Suriform forms.
 */

/**
 * Validate that form field is required if another field matches a value.
 * Example: <input type="text" required-if="checkbox:true" />
 */
export const requiredIf = {
  validate: (_, [targetExpect], { form }) => {
    if (!targetExpect) return false
    const [target, expected] = targetExpect.split(':')
    return form[target] === expected
  },
  checksTarget: true,
  checksRequired: true
}

/**
 * Validate that form field is required unless another field matches a value.
 * Example: <input type="text" required-unless="checkbox:true" />
 */
export const requiredUnless = {
  validate: (_, [targetExpect], { form }) => {
    if (!targetExpect) return false
    const [target, expected] = targetExpect.split(':')
    return form[target] !== expected
  },
  checksTarget: true,
  checksRequired: true
}

/**
 * Validate that form field is required if another field has a value.
 * Example: <input type="text" required-with="email" />
 */
export const requiredWith = {
  validate: (_, [target], { form }) => {
    if (!target) return false
    return !!form[target]
  },
  checksTarget: true,
  checksRequired: true
}

/**
 * Validate that form field is required if all referenced form fields have values.
 * Example: <input type="text" required-with-all="firstName,lastName" />
 */
export const requiredWithAll = {
  validate: (_, targets, { form }) => {
    if (!targets) return false
    return targets.every((target) => form[target])
  },
  checksTarget: true,
  checksRequired: true
}

/**
 * Grouped required rules for easy import
 */
export const requiredRules = {
  requiredIf,
  requiredUnless,
  requiredWith,
  requiredWithAll
}
