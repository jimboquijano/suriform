/**
 * @file core/watch.js
 * @description Form field and dependency watchers for Suriform.
 *
 * Provides functions to monitor user interactions on form fields and
 * handle dependent field relationships dynamically. Manages validation
 * triggers and ensures proper attachment and cleanup of watchers.
 */

import { validateForm, validateField } from './validate'
import { resetForm } from './validate'
import { debounce } from '../helpers/dom'

/**
 * Attach a submit handler to a form for pre-submission validation.
 *
 * 1. Prevent default submission if `validateOnSubmit` is enabled.
 * 2. Run validation on all form fields via `validateForm`.
 * 3. Submit the form normally if all validations pass and `__sfAjax` is not used.
 * 4. Attach the handler reference on the form for later removal.
 *
 * @param {HTMLFormElement} form - Form to attach submit listener.
 * @param {Object} [options={}] - Form options for validation behavior.
 */
export function handleSubmit(form, options = {}) {
  if (!options.validateOnSubmit) return

  // Submit handler to be attached to the form
  const submitHandler = async (e) => {
    e.preventDefault()

    // Run validation for all form fields
    const result = await validateForm(form, options.stopOnFirstError)
    if (!result.isValid) return

    // Submit the form normally if not using AJAX
    if (!form.__sfAjax) form.submit()
  }

  // Reset handler to be attached to the form
  const resetHandler = () => resetForm(form)

  // Listen for events and attach handlers
  form.setAttribute('novalidate', '')
  form.addEventListener('submit', submitHandler)
  form.addEventListener('reset', resetHandler)
  form.__sfSubmit = submitHandler
  form.__sfReset = resetHandler
}

/**
 * Remove the submit event listener from a form.
 *
 * 1. Check if the form has a attached submit handler.
 * 2. Remove the submit event listener from the form.
 * 3. Delete the internal reference to prevent memory leaks.
 *
 * @param {HTMLFormElement} form - Form to detach the submit listener from.
 */
export function unhandleSubmit(form) {
  if (form.__sfSubmit) {
    form.removeEventListener('submit', form.__sfSubmit)
    delete form.__sfSubmit
  }

  if (form.__sfReset) {
    form.removeEventListener('reset', form.__sfReset)
    delete form.__sfReset
  }

  form.removeAttribute('novalidate')
}

/**
 * Attach a delegated input listener to a form for field validation.
 *
 * 1. Listens for `input` events on all descendant fields.
 * 2. Supports per-field debounce via the `sfdebounce` attribute.
 * 3. Uses `validateField` to trigger validation on each input.
 * 4. Automatically handles dynamically added or removed fields.
 * 5. Attaches the handler reference for later removal.
 *
 * @param {HTMLFormElement} form - Form to attach input listener.
 * @param {Object} [options={}] - Form options controlling validation triggers.
 */
export function handleInput(form, options = {}) {
  if (!options.validateOnInput) return

  // Input handler to be attached to the form
  const inputHandler = async (e) => {
    const attrDelay = parseInt(e.target.getAttribute('sfdebounce'), 10)
    const delay = attrDelay ?? options.debounce ?? 0

    // Validate a single field
    const validate = async () => {
      await validateField(e.target)
    }

    delay > 0 ? debounce(validate, delay)() : validate()
  }

  // Listen for events and attach handlers
  form.addEventListener('input', inputHandler)
  form.__sfInput = inputHandler
}

/**
 * Remove the delegated input listener from a form.
 *
 * 1. Checks if the form has a attached input handler.
 * 2. Removes the listener from the form.
 * 3. Deletes internal references for proper cleanup.
 *
 * @param {HTMLFormElement} form - Form to detach input listener.
 */
export function unhandleInput(form) {
  if (form.__sfInput) {
    form.removeEventListener('input', form.__sfInput)
    delete form.__sfInput
  }
}

/**
 * Attach a delegated blur listener to a form for field validation.
 *
 * 1. Listens for `blur` events on all descendant fields using capture phase.
 * 2. Triggers validation on the blurred field when `validateOnBlur` is enabled.
 * 3. Automatically supports dynamic field creation or removal.
 * 4. Attaches the handler reference for later removal.
 *
 * @param {HTMLFormElement} form - Form to attach blur listener.
 * @param {Object} [options={}] - Form options controlling validation triggers.
 */
export function handleBlur(form, options = {}) {
  if (!options.validateOnBlur) return

  // Blur handler to be attached to the form
  const blurHandler = async (e) => {
    await validateField(e.target)
  }

  // Listen for events and attach handlers
  form.addEventListener('blur', blurHandler, true)
  form.__sfBlur = blurHandler
}

/**
 * Remove the delegated blur listener from a form.
 *
 * 1. Checks if the form has a attached blur handler.
 * 2. Removes the listener from the form.
 * 3. Deletes internal references for proper cleanup.
 *
 * @param {HTMLFormElement} form - Form to detach blur listener.
 */
export function unhandleBlur(form) {
  if (form.__sfBlur) {
    form.removeEventListener('blur', form.__sfBlur, true)
    delete form.__sfBlur
  }
}
