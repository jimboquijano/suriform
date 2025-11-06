/**
 * @file core/validate.js
 * @description Form and form field validators for Suriform.
 *
 * Coordinates field-level and form-level validation, applying rules and
 * managing error messages consistently across forms. Supports synchronous and
 * asynchronous rules, required checks, and adaptive error display strategies.
 */

import { validateRule, resolveMessage } from './rules'
import { getRuleCache, reqRegistry } from './rules'
import { showError, hideError } from './error'
import { required } from '../rules/native'

/**
 * Validate all form controls and stop at the first invalid field.
 *
 * 1. Collect all input, select, and textarea elements in the form.
 * 2. Iterate through each field and validate using `validateField`.
 * 3. Stop immediately if `stopOnFirstError` is set and an invalid field is found.
 * 4. Trigger form-level hooks based on the validation results.
 *
 * @param {HTMLFormElement} form - Form to validate.
 * @param {boolean} stopOnFirstError - Whether to stop on first invalid result.
 * @returns {Promise<boolean>} Resolves with overall form validity status.
 */
export async function validateForm(form, stopOnFirstError = true) {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError('[SF] validateForm() requires a valid <form> element.')
  }

  // Set initial results
  const result = { isValid: true, errors: [] }

  // Run validation for each form field
  for (const field of retrieveFields(form)) {
    const { isValid, message } = await validateField(field, true)

    if (!isValid) {
      result.isValid = false
      result.errors.push({ field, message })

      // Stop on first error if needed
      if (stopOnFirstError) break
    }
  }

  triggerHooks(result, form)

  return result
}

/**
 * Validate a single form field and update its error state.
 *
 * 1. Perform required checks for the field.
 * 2. Run all applicable validation rules if necessary.
 * 3. Update the field’s visual error state using toggleError.
 * 4. Trigger Suriform hooks for the field and form as appropriate.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - Field to validate.
 * @param {boolean} fromSubmit - Flag to determine if its from a form submission.
 * @returns {Promise<{isValid: boolean, message: string}>} Resolves with the field validity result.
 */
export async function validateField(field, fromSubmit = false) {
  const validValue = required.validate(field)
  const isRequired = await isFieldRequired(field)
  let result

  // Not required and empty → skip
  if (!isRequired && !validValue) {
    result = { isValid: true, message: '' }
  }

  // Required and empty → fail
  else if (isRequired && !validValue) {
    const message = resolveMessage('required', field, required)
    result = { isValid: false, message }
  }

  // Anything else → validate rules
  else {
    field.setAttribute('aria-busy', 'true')
    result = await checkFieldValidity(field)
    field.removeAttribute('aria-busy')
  }

  // Show or hide error based on result
  const toggleError = !result.isValid ? showError : hideError
  toggleError(field, result.message)

  if (!fromSubmit) {
    triggerHooks(result, field)
  }

  return result
}

/**
 * Reset a form’s validation state and optionally clear field values.
 *
 * 1. Iterate through all <input>, <select>, and <textarea> fields in the form.
 * 2. Clear any visual error messages and invalid state for each field.
 *
 * @param {HTMLFormElement} form - The target form whose validation state should be reset.
 */
export function resetForm(form) {
  for (const field of retrieveFields(form)) {
    hideError(field)
  }

  // Trigger reset hooks
  form.__sfValidity?._emit('onReset')
}

/**
 * Check if a field is required based on conditional rules.
 *
 * 1. Iterate through all rules in `reqRegistry`.
 * 2. Evaluate any rules declared on the field and stop at the first requirement.
 * 3. Combine native HTML `required` attribute with conditional rules.
 * 4. Return true if the field is required, false otherwise.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - Field to evaluate.
 * @returns {boolean} True if the field is required, false otherwise.
 */
export async function isFieldRequired(field) {
  if (!field) return false
  let isRequired = false

  // Execute each required rule in order
  for (const [ruleName, rule] of Object.entries(reqRegistry)) {
    if (field.hasAttribute(ruleName)) {
      isRequired = await validateRule(rule, field)
      if (isRequired) break
    }
  }

  return field.required || isRequired
}

/**
 * Run all validation rules for a specific form field.
 *
 * 1. Retrieve applicable rules from the cache or build them anew.
 * 2. Execute each rule in order until the first failing rule is found.
 * 3. Set the first error message as the result and halt further evaluation.
 * 4. Return an object `{ isValid, message }` reflecting the field’s validation state.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - Field to validate.
 * @returns {Promise<Object>} Resolves to an object with validity and message.
 */
export async function checkFieldValidity(field) {
  const result = { isValid: true, message: '' }

  // Retrieve applicable rules (cached or newly built)
  const applicableRules = getRuleCache(field)

  // Execute each rule in order until the first failure
  for (const rule of applicableRules) {
    const error = await validateRule(rule, field)

    if (error) {
      result.message = error
      result.isValid = false
      break
    }
  }

  return result
}

/**
 * Submit a form using Fetch API with validation-safe defaults.
 *
 * 1. Collect the form action URL and method.
 * 2. Validate the URL to ensure it is absolute or root-relative.
 * 3. Send the form data using Fetch with POST if applicable.
 * 4. Throw an error if the request fails or the response is not OK.
 * 5. Return the Fetch Response object if successful.
 *
 * @param {HTMLFormElement} form - Target form to submit.
 * @returns {Promise<Response>} Resolves to Fetch response object.
 * @throws {Error} If submission fails or the action URL is invalid.
 */
export async function submitFormData(form) {
  const action = form.getAttribute('action') || window.location.href
  const method = (form.getAttribute('method') || 'GET').toUpperCase()
  const formData = new FormData(form)

  // Validate the action URL — must be absolute or root-relative
  if (!/^https?:|^\//.test(action)) {
    throw new Error(`[SF] Invalid form action '${action}'`)
  }

  // Execute the request with Fetch API
  const response = await fetch(action, {
    method,
    body: method !== 'GET' ? formData : undefined
  })

  if (!response.ok) {
    throw new Error(`[SF] Request failed with status ${response.status}`)
  }

  return response
}

/**
 * Trigger Suriform hooks for a form or form field based on validation results.
 *
 * 1. If the element is a form:
 *    a. Execute optional AJAX hooks (`onSuccess` / `onError`) if `__sfAjax` is configured.
 *    b. Trigger the form-level `onFail` and `onPass` hook.
 * 2. If the element is a field:
 *    a. Determine the hook type (`onValid` or `onInvalid`) based on field validity.
 *    b. Trigger field-level hooks via the form’s `__sfValidity` emitter.
 *
 * @param {Object} result - Validation result object `{ isValid, message }`.
 * @param {HTMLFormElement|HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - Target element for hooks.
 */
export async function triggerHooks(result, field) {
  const { isValid, message, errors } = result

  if (field instanceof HTMLFormElement) {
    const form = field

    // Form AJAX hooks
    if (form.__sfAjax && isValid) {
      try {
        const response = await submitFormData(form)
        form.__sfAjax?._emit('onSuccess', response)
      } catch (err) {
        form.__sfAjax?._emit('onError', err)
        return false
      }
    }

    // Form validity hook
    const hook = isValid ? 'onPass' : 'onFail'
    form.__sfValidity?._emit(hook, errors)

    return
  }

  // Form field validity hooks
  const hook = isValid ? 'onValid' : 'onInvalid'
  field.form?.__sfValidity?._emit(hook, { field, message })
}

/**
 * Retrieve all form fields that need to be validated.
 *
 * 1. Returns all <input>, <select>, and <textarea> elements within the form.
 *
 * @param {HTMLFormElement} form - Form to retrieve form fields from.
 * @returns {NodeListOf<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} Watchable form fields.
 */
export function retrieveFields(form) {
  return form.querySelectorAll('input, select, textarea')
}
