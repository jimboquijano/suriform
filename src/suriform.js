/**
 * @file suriform.js
 * @description Main entry point for Suriform — a lightweight, modular validation engine for HTML forms.
 *
 * Provides a form-centric API for validation and form field handling.
 * Supports dynamic form field observation, submit handling, and locale-aware messages.
 * Exposes rule definitions, templates, and locale settings globally for flexibility.
 *
 * Each form is connected to Suriform via a small API to update options, change locale,
 * or connect/disconnect validation handlers dynamically. No heavy instance state is
 * maintained; forms can be managed individually and updated without reloading the page.
 */

import { unhandleSubmit, unhandleInput, unhandleBlur } from './core/watch'
import { handleSubmit, handleInput, handleBlur } from './core/watch'
import { validateForm, resetForm } from './core/validate'
import { defineRule, defineRules } from './core/rules'
import { localize, setLocale } from './core/i18n'

/* -------------------------------------------------------------------------- */
/* Main API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Default configuration for all Suriform instances.
 *
 * @property {number} debounce - Delay (ms) before validating form field after user interaction.
 * @property {boolean} validateOnSubmit - Run validation on form submit event.
 * @property {boolean} validateOnBlur - Run validation on form field blur event.
 * @property {boolean} validateOnInput - Run validation on every form field input/change event.
 * @property {boolean} stopOnFirstError - Stop validation on the first error encountered.
 */
const defaultOptions = {
  debounce: 0,
  validateOnSubmit: true,
  validateOnBlur: false,
  validateOnInput: false,
  stopOnFirstError: true
}

/**
 * Initializes a watcher on a single form element.
 *
 * Sets up validation handlers, form field watchers, and locale context. Options can be
 * provided to control triggers, debounce timing, and other form-specific settings.
 * Returns an API to update options, connect or disconnect watchers from the form.
 *
 * @param {HTMLFormElement} form - The form to manage with Suriform.
 * @param {Object} [opts={}] - Partial options to override defaults.
 * @returns {Object} API with `setOptions`, `reconnect`, and `disconnect`.
 */
export function watchForm(form, opts = {}) {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError('[SF] watchForm() requires a valid <form> element.')
  }

  // Flag to connect/disconnect
  let connected = false

  // Merge instance options with defaults
  let options = { ...defaultOptions, ...opts }

  /**
   * Dynamically update instance options after initialization.
   *
   * Merges new options with existing configuration and updates internal settings.
   * Can be used to enable/disable validation triggers or update debounce timing.
   *
   * @param {Object} newOptions - Partial options to merge into the current configuration.
   */
  function setOptions(newOptions = {}) {
    if (!Object.entries(newOptions).some(([k, v]) => options[k] !== v)) return

    disconnect()
    options = { ...options, ...newOptions }
    reconnect()
  }

  /**
   * Connect the instance to its form.
   *
   * Registers submit and form field event listeners. Ensures field are observed
   * according to the instance options. Has no effect if already connected.
   */
  function reconnect() {
    if (connected) return
    connected = true

    handleSubmit(form, options)
    handleInput(form, options)
    handleBlur(form, options)
  }

  /**
   * Disconnect the instance from its form.
   *
   * Removes event listeners and stops form field observation. Allows for safe cleanup
   * without destroying the form or instance. Has no effect if already disconnected.
   */
  function disconnect() {
    if (!connected) return
    connected = false

    unhandleSubmit(form)
    unhandleInput(form)
    unhandleBlur(form)
  }

  // Connect immediately
  reconnect()

  return { setOptions, reconnect, disconnect }
}

/* -------------------------------------------------------------------------- */
/* Global APIs                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Exported global helpers and rule management functions.
 *
 * These can be used for defining new rules, registering locales,
 * or performing validation outside of instance context.
 */
export { defineRule, defineRules, localize, setLocale, validateForm, resetForm }
