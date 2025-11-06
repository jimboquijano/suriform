/**
 * @file core/rules.js
 * @description Core validation rules engine for Suriform.
 *
 * Handles registration, storage, and retrieval of all validation rules.
 * Supports synchronous and asynchronous rules, cross-field rules, and
 * integrates seamlessly with message utilities for uniform feedback.
 */

import { splitParams } from '../helpers/format'
import { getFormData, getFieldValue } from '../helpers/dom'
import { formatPositional, formatKeyValue } from './i18n'
import { getName, getMessage } from './i18n'

export const ruleRegistry = {}
export const reqRegistry = {}
export let ruleCache = new WeakMap()
export const resultCache = new Map()

/**
 * Register a single validation rule globally.
 *
 * 1. Normalize the rule name to kebab-case and assign attributes.
 * 2. Store the rule in the proper registry (regular or required rules).
 * 3. Clear the rule cache so all fields can pick up the new rule.
 *
 * @param {string} ruleName - Unique identifier for the rule.
 * @param {Object} rule - Rule definition object.
 * @param {Function} rule.validate - Validation function to execute.
 * @param {string} [rule.message] - Optional default error message.
 * @param {Function} [rule.format] - Optional formatting function for message interpolation.
 */
export function defineRule(ruleName, rule = {}) {
  if (!ruleName || typeof rule.validate !== 'function') {
    console.error(`[SF] defineRule() requires a valid "name" and "validate" function.`)
    return
  }

  // Normalize attr to kebab-case (e.g., alphaDash -> alpha-dash)
  rule.name = ruleName
  rule.attr = ruleName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()

  // Store the rule in the registry
  const registry = rule.checksRequired ? reqRegistry : ruleRegistry
  registry[rule.attr] = rule

  // Clear rule cache so all fields will pick up the new rule
  resetRuleCache()
}

/**
 * Register multiple validation rules at once.
 *
 * 1. Validate that the input is an object.
 * 2. Iterate over each ruleName: ruleDefinition pair.
 * 3. Register each rule individually using defineRule.
 *
 * @param {Object} rulesObj - Object containing multiple rules.
 */
export function defineRules(rulesObj) {
  if (!rulesObj || typeof rulesObj !== 'object') {
    console.error('[SF] defineRules() expects an object with ruleName: rule pairs.')
    return
  }

  // Iterate and register each rule individually
  for (const [ruleName, rule] of Object.entries(rulesObj)) {
    defineRule(ruleName, rule)
  }
}

/**
 * Validate a single form field using a given rule.
 *
 * 1. Build validation context and extract parameters from the field.
 * 2. Execute the validation function, handling synchronous or asynchronous results.
 * 3. Check for required rules and immediate pass/fail conditions.
 * 4. Resolve the error message using group overrides, localization, and formatting.
 * 5. Interpolate the message using key pair or positional formatting before returning.
 *
 * @param {Object} rule - Rule object with name, validate function, and optional message.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - Field to validate.
 * @returns {Promise<string|undefined>} Error message if invalid; otherwise undefined.
 */
export async function validateRule(rule, field) {
  let { name, attr, validate, checksRequired = false } = rule

  try {
    // Build validation context information
    const context = getContext(field, attr)
    const { value, attrValue, params, type } = context
    const cacheKey = `${name}:${value}:${attrValue}`

    // Checks and returns cache if NOT target and file types
    if (type !== 'file' && !rule.checksTarget && resultCache.has(cacheKey)) {
      return resultCache.get(cacheKey)
    }

    // Retrieve form and field values
    if (rule.checksTarget && field.form) {
      context.form = getFormData(field.form)
    }

    // Execute the rule's validation function
    const output = validate(value, params, context)
    let resultKey = output && typeof output.then === 'function' ? await output : output

    // Return right away for require type
    if (checksRequired) {
      resultCache.set(cacheKey, resultKey)
      return resultKey
    }

    // Return right away for passing validation
    if (resultKey == null || resultKey === true) {
      resultCache.set(cacheKey, undefined)
      return undefined
    }

    // Handle false result
    if (resultKey === false) {
      resultKey = name
    }

    // Handle valid result
    if (typeof resultKey === 'string') {
      const resolvedMessage = resolveMessage(resultKey, field, rule)
      const finalMessage = formatMessage(resolvedMessage, field, rule, context)

      resultCache.set(cacheKey, finalMessage)
      return finalMessage
    }

    resultCache.set(cacheKey, undefined)
    return undefined
  } catch (err) {
    console.error(`[SF] Error in rule "${name}":`, err)
  }
}

/**
 * Build a full validation context for a field.
 *
 * 1. Retrieve the current value and attribute paramaters of the field.
 * 2. Return a context object including field name, type, value and params.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - Field to build context for.
 * @param {Object} attr - Validation rule attribute.
 * @returns {Object} Context object for validation.
 */
export function getContext(field, attr) {
  const value = getFieldValue(field)
  const attrValue = field.getAttribute(attr)
  const params = splitParams(attrValue)

  return {
    field: field.name,
    type: field.type,
    value,
    attrValue,
    params
  }
}

/**
 * Format the final validation message for a failed rule.
 *
 * 1. Apply group-based overrides for message, params, or format arrays.
 * 2. Interpolate the resolved message using key-value or positional replacements.
 * 3. Return the completed message string for display or summary.
 *
 * @param {string|Object} resolvedMessage - Resolved message string or override object.
 * @param {HTMLElement} field - Field to base the resolved field name.
 * @param {Object} rule - Validation rule containing message and format options.
 * @param {Object} context - Validation context containing value and param.
 * @returns {string} Fully formatted message string.
 */
export function formatMessage(resolvedMessage, field, rule, context) {
  let { message, format = [] } = rule
  let { value, params } = context

  // Check for params/format overrides from group
  if (typeof resolvedMessage === 'object') {
    ;({ message, params, format } = resolvedMessage)
  } else {
    message = resolvedMessage
  }

  // Retrieve formatted field name
  const formatted = resolveName(field)

  // Interpolate via key pair
  if (typeof format === 'function') {
    const keyValue = format(value, params, context)
    return formatKeyValue(message, formatted, keyValue)
  }

  // Interpolate via position with params and format
  return formatPositional(message, formatted, params, format)
}

/**
 * Resolve the final validation message for a rule.
 *
 * 1. Check for group-level overrides in the form.
 * 2. Retrieve the localized message for the current form locale.
 * 3. Fall back to the default message if none is found.
 *
 * @param {string} resultKey - Rule message or locale key.
 * @param {HTMLElement} field - Field being validated.
 * @param {Object} rule - Validation rule containing message and name.
 * @returns {string} Resolved validation message.
 */
export function resolveMessage(resultKey, field, rule) {
  let { message, name, attr } = rule
  const groupHandler = field.form?.__sfMessage?.group
  const formLocale = field.form?.__sfLocale

  // Apply group override if defined
  if (groupHandler) {
    const groupResult = groupHandler({ field, attr })

    if (groupResult) {
      groupResult.message = getMessage(groupResult.message, formLocale)
      return groupResult
    }
  }

  // Retrieve localized message
  let resolved = getMessage(resultKey, formLocale)

  // Fallback to default if needed
  if (resolved == name) {
    resolved = message || 'The {field} field is invalid.'
  }

  return resolved
}

/**
 * Get a human-readable label for a field.
 *
 * 1. Attempt to use the localized field name first.
 * 2. Fallback to a prettified version of the field name if localization is not available.
 * 3. Use aria-label, id, or default to 'Field' if no other label can be determined.
 *
 * @param {HTMLElement} field - Field element to resolve the label for.
 * @returns {string} Human-friendly label for the field.
 */
export function resolveName(field) {
  const fieldName = field.name || ''
  const formLocale = field.form?.__sfLocale

  if (fieldName) {
    // Attempt localized name first
    const localized = getName(fieldName, formLocale)
    if (localized && localized !== fieldName) return localized

    // Fallback: prettify field name (capitalize words, replace -/_)
    return fieldName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  // Other fallbacks: aria-label, id, or default
  return field.getAttribute('aria-label') || field.id || 'Field'
}

/**
 * Retrieve or cache the applicable rules for a field.
 *
 * 1. Check the WeakMap cache for previously computed rules.
 * 2. Collect rules from the registry that match field type or attributes.
 * 3. Store the computed rules in cache for future retrieval.
 *
 * @param {HTMLElement} field - Field to retrieve rules for.
 * @returns {Array<Object>} Applicable rule objects.
 */
export function getRuleCache(field) {
  // Return cached rules if available
  let applicableRules = ruleCache.get(field)
  if (applicableRules) return applicableRules
  applicableRules = []

  // Collect rules from registry that match field attributes or type
  for (const [ruleName, rule] of Object.entries(ruleRegistry)) {
    if ((rule.type && field.type === rule.type) || field.hasAttribute(ruleName)) {
      applicableRules.push(rule)
    }
  }

  // Cache rules for future use
  ruleCache.set(field, applicableRules)

  return applicableRules
}

/**
 * Clear cached rules for all fields.
 *
 * 1. Reset the WeakMap that stores cached rules.
 * 2. Forces recomputation of rule sets during subsequent validations.
 * 3. Calls `resetResultCache` to clear all results cache.
 */
export function resetRuleCache() {
  ruleCache = new WeakMap()
  resetResultCache()
}

/**
 * Clear cached results for all rules.
 *
 * 1. Reset the Map that stores cached results.
 * 2. Forces resolving of rule message during subsequent validations.
 */
export function resetResultCache() {
  resultCache.clear()
}
