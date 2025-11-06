/**
 * @file tools/hooks.js
 * @description Suriform modular event hook APIs for forms.
 *
 * Attaches a controller to each form element, offering a clean,
 * event-driven API to extend Suriform behavior programmatically or
 * declaratively. Each hook type is initialized only once per form.
 */

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Initialize a Suriform AJAX hooks controller for a form.
 *
 * Registers a `__sfAjax` controller under the form element, allowing
 * Suriform or user code to attach custom event listeners for AJAX submission
 * success and failure events. Ensures each form initializes only once and
 * provides a stable, event-based interface for all AJAX operations.
 *
 * @param {HTMLFormElement} form - The form element to attach the hook.
 * @returns {Object} The Suriform AJAX hooks controller API.
 * @throws {Error} If `form` is not a valid <form> element.
 */
export function useAjax(form) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[SF] useAjax() requires a valid form element.')
  }

  if (form.__sfAjax) return form.__sfAjax

  /** @type {Record<string, Function[]>} */
  const listeners = {
    onSuccess: [],
    onError: []
  }

  const api = Object.assign(createHookAPI(form, listeners), {
    /**
     * Register callback for successful AJAX submission.
     * @param {(response: any, form: HTMLFormElement) => void} fn
     */
    onSuccess(fn) {
      if (typeof fn === 'function') listeners.onSuccess.push(fn)
    },

    /**
     * Register callback for failed AJAX submission.
     * @param {(error: any, form: HTMLFormElement) => void} fn
     */
    onError(fn) {
      if (typeof fn === 'function') listeners.onError.push(fn)
    }
  })

  form.__sfAjax = api
  return api
}

/**
 * Initialize a Suriform validation hooks controller for a form.
 *
 * Registers a `__sfValidity` controller under the form element, allowing
 * Suriform or user code to attach custom event listeners for both field-level
 * and form-level validation events. Ensures consistent, centralized handling
 * of validation success and failure states.
 *
 * @param {HTMLFormElement} form - The form to attach the hook.
 * @returns {Object} The Suriform validation hooks controller API.
 * @throws {Error} If `form` is not a valid <form> element.
 */
export function useValidity(form) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[SF] useValidity() requires a valid form element.')
  }

  if (form.__sfValidity) return form.__sfValidity

  /** @type {Record<string, Function[]>} */
  const listeners = {
    onValid: [],
    onInvalid: [],
    onFail: [],
    onPass: [],
    onReset: []
  }

  const api = Object.assign(createHookAPI(form, listeners), {
    /**
     * Register callback for form field validation failure.
     * @param {(field: HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement, result: object) => void} fn
     */
    onInvalid(fn) {
      if (typeof fn === 'function') listeners.onInvalid.push(fn)
    },

    /**
     * Register callback for form field validation success.
     * @param {(field: HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement, result: object) => void} fn
     */
    onValid(fn) {
      if (typeof fn === 'function') listeners.onValid.push(fn)
    },

    /**
     * Register callback for form validation failure.
     * @param {(form: HTMLFormElement, result: object) => void} fn
     */
    onFail(fn) {
      if (typeof fn === 'function') listeners.onFail.push(fn)
    },

    /**
     * Register callback for form validation success.
     * @param {(form: HTMLFormElement, result: object) => void} fn
     */
    onPass(fn) {
      if (typeof fn === 'function') listeners.onPass.push(fn)
    },

    /**
     * Register callback for form validation success.
     * @param {(form: HTMLFormElement, result: object) => void} fn
     */
    onReset(fn) {
      if (typeof fn === 'function') listeners.onReset.push(fn)
    }
  })

  form.__sfValidity = api
  return api
}

/* -------------------------------------------------------------------------- */
/* Internal Helpers                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Internal helper: Create a lightweight hook API with safe event emission.
 *
 * @param {HTMLFormElement} form - The target form element.
 * @param {Record<string, Function[]>} listeners - Event listeners map.
 * @returns {Object} Hook API with event registration via `_emit` method.
 */
export function createHookAPI(form, listeners) {
  return {
    el: form,

    /**
     * Internal: Safely emit a specific event and invoke all registered listeners.
     * @param {string} type - The event type to emit.
     * @param {...any} args - Arguments passed to each listener.
     */
    _emit(type, ...args) {
      const fns = listeners[type]
      if (!fns?.length) return

      for (const fn of fns) {
        try {
          fn(...args)
        } catch (err) {
          console.error(`[SF] Error in ${type} callback:`, err)
        }
      }
    }
  }
}
