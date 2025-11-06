/**
 * @file tools/summary.js
 * @description Suriform utility for handling stateful validation summary.
 *
 * Collects and displays all active field errors in a concise, accessible list.
 * Each entry allows direct navigation to its corresponding form field, providing
 * a centralized overview of form validation state for users and screen readers.
 */

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Initializes a validation summary interface for a Suriform form.
 *
 * Tracks active validation errors and renders them into the provided
 * container element. Clicking an error scrolls to and focuses its field,
 * supporting both accessibility and usability in large forms.
 *
 * @param {HTMLFormElement} form - The target form element to enhance with a validation summary.
 * @param {Object} [options] - Optional configuration for summary behavior and rendering.
 * @param {boolean} [options.highlightOnHover=true] - If `true`, highlights the related form field.
 * @param {boolean} [options.scrollOnClick=true] - If `true`, smoothly scrolls the viewport to the field.
 * @param {boolean} [options.includePrefix=true] - If `true`, each error message will have a prefix.
 * @param {HTMLElement} [options.container=form] - The container where the summary list will be rendered.
 * @returns {Object} The summary control interface.
 * @throws {Error} If `container` is not a valid HTMLElement.
 */
export function withSummary(form, options = {}) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[SF] withSummary() requires a valid form element.')
  }

  // Merge user options with defaults
  const config = {
    highlightOnHover: true,
    scrollOnClick: true,
    includePrefix: true,
    container: form,
    ...options
  }

  // The summary container (form or custom)
  const container = getContainer(config.container)

  // Stores all active errors
  const errors = new Map()

  // Sets the initial field order
  const fieldOrder = getFieldOrder(form)

  /**
   * Adds an error entry to the summary.
   *
   * Registers or updates a validation error message in the summary list.
   * Each error is keyed by the field itself for precise synchronization.
   *
   * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The form field reporting the error.
   * @param {string} message - Error message to display.
   */
  function addError(field, message) {
    if (!isValidField(field, form) || !container) return

    // Create summary item and bind events
    const item = createItem(field, message, errors, config)
    bindEvents(item, field, config)

    // Sort errors if needed then render the list
    const sorted = sortErrors(errors, fieldOrder)
    renderList(sorted, container)
  }

  /**
   * Removes a registered error from the summary.
   *
   * Deletes the entry associated with the given form field.
   * If no remaining errors exist, the summary is cleared.
   *
   * @param {HTMLElement} field - The form field whose error should be removed.
   */
  function removeError(field) {
    if (!isValidField(field, form)) return

    // Check if error item exist
    const error = errors.get(field)

    // Delete error and re-render summary if needed
    if (error) {
      errors.delete(field)
      error.remove()
    }

    // Destroy list if needed
    destroyList(errors, container)
  }

  /**
   * Displays a provided list of summary validation errors.
   *
   * Overrides the existing errors map with the given array of error objects,
   * each containing a `field` (HTMLElement) and a `message` (string).
   * Triggers a full re-render of the summary list.
   *
   * @param {Array<{field: HTMLElement, message: string}>} newErrors - Array of error entries to show.
   */
  function addErrors(newErrors) {
    if (!Array.isArray(newErrors)) {
      throw new Error('[SF] addErrors() requires an array of { field, message } objects.')
    }

    if (!container) return

    // Clear errors
    removeErrors()

    // Populate the map with new entries
    for (const { field, message } of newErrors) {
      if (isValidField(field, form)) {
        const item = createItem(field, message, errors, config)
        bindEvents(item, field, config)
      }
    }

    // Render the summary list
    renderList(errors, container)
  }

  /**
   * Removes all registered validation errors except for the specified field.
   *
   * Iterates through all tracked error entries and deletes them from
   * the summary, ensuring only the chosen field’s error remains visible.
   *
   * @param {HTMLElement} [exceptField] - Optional form field whose error should remain visible.
   */
  function removeErrors(exceptField) {
    for (const field of errors.keys()) {
      if (exceptField && field === exceptField) continue
      removeError(field)
    }
  }

  return { addError, removeError, addErrors, removeErrors }
}

/* -------------------------------------------------------------------------- */
/* Internal Helpers                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Checks whether a given field is a valid HTMLElement contained within the form.
 *
 * This ensures we only attempt to show/hide popups on elements that actually exist
 * in the DOM and belong to the target form.
 *
 * @param {HTMLElement} field - The form field to validate.
 * @param {HTMLFormElement} form - The form that should contain the field.
 * @returns {boolean} True if the field is a valid DOM element within the form.
 */
export function isValidField(field, form) {
  const isHtmlElement = field instanceof HTMLElement
  const belongsToForm = form.contains(field)

  return isHtmlElement && belongsToForm
}

/**
 * Render the validation error summary list.
 *
 * Handles container resolution, error sorting, and DOM rendering.
 * Dynamically creates or updates a `<ul>` reflecting all active
 * validation errors. Each list item links to its corresponding field.
 *
 * @param {Map<HTMLElement, string>} errors - Collection of validation errors.
 * @param {Object} container - The container to render the summary into
 * @param {Object} config - Optional configuration for prefix.
 * @returns {HTMLUListElement} The rendered `<ul>` summary list element.
 */
export function renderList(errors, container) {
  let ul = container.querySelector('ul.suriform-summary')

  // Create <ul> summary list
  if (!ul) {
    ul = document.createElement('ul')
    ul.className = 'suriform-summary'
  }

  // Populate <ul> with all error messages
  for (const [field, li] of errors.entries()) {
    ul.appendChild(li)
  }

  // Append list if not already in DOM
  if (!ul.parentElement) container.appendChild(ul)

  return ul
}

/**
 * Removes the validation summary list when no errors remain.
 *
 * Checks the active error Map and, if empty, removes the associated
 * `<ul class="suriform-summary">` element from the container. This
 * keeps the DOM clean and prevents displaying empty summaries.
 *
 * @param {Map<HTMLElement, HTMLElement>} errors - Map of tracked form fields and their corresponding list items.
 * @param {HTMLElement} container - The container that may hold the summary list.
 * @returns {HTMLUListElement} The rendered `<ul>` summary list element.
 */
export function destroyList(errors, container) {
  let ul = container.querySelector('ul.suriform-summary')

  if (errors.size == 0 && ul) {
    ul.remove()
  }

  return ul
}

/**
 * Creates or updates a validation summary list item.
 *
 * Generates a `<li>` element representing a field error, storing it
 * in the provided `errors` map keyed by its field. If the field already
 * has an entry, its message is simply updated instead of re-creating
 * the DOM element.
 *
 * The resulting list item includes a `data-field-key` attribute for lookup,
 * and is keyboard-focusable (`tabindex="0"`) for accessibility.
 *
 * @param {HTMLElement} field - The form field that triggered the validation error.
 * @param {string} message - The validation error message to display.
 * @param {Map<HTMLElement, HTMLElement>} errors - Map that tracks all current field errors and their list items.
 * @param {Object} [config={}] - Optional summary configuration.
 * @param {boolean} [config.includePrefix=true] - Whether to prefix the message with the field key.
 * @returns {HTMLLIElement} The newly created or updated summary list item element.
 */
export function createItem(field, message, errors, config = {}) {
  let item = errors.get(field)

  // Construct fieldKey and message
  const fieldKey = field.name || field.id || field.getAttribute('aria-label')

  if (config.includePrefix && fieldKey) {
    message = `${fieldKey}: ${message}`
  }

  // Update item and return right away
  if (item) {
    item.textContent = message
    return item
  }

  // Create a template element
  const li = `<li data-field-key="${fieldKey}" tabindex="0">${message}</li>`
  const template = document.createElement('template')
  template.innerHTML = li.trim()

  // Extract the first child (the actual <li> element)
  item = template.content.firstChild
  errors.set(field, item)

  return item
}

/**
 * Get or create a container for the summary list.
 *
 * If the provided container is a <form>, a wrapper <div>
 * will be created above it to hold the summary list.
 *
 * @param {HTMLElement} container - The original container element.
 * @returns {HTMLElement|null} The container to render the summary into, or null if invalid.
 */
export function getContainer(container) {
  if (!(container instanceof HTMLElement)) return null

  if (container.tagName === 'FORM') {
    let wrapper = container.previousElementSibling

    // Only create if not already existing
    if (!wrapper || !wrapper.classList.contains('suriform-summary-wrapper')) {
      wrapper = document.createElement('div')
      wrapper.className = 'suriform-summary-wrapper'
      container.parentNode.insertBefore(wrapper, container)
    }

    return wrapper
  }

  return container
}

/**
 * Sorts a Map of validation errors according to the canonical order of form fields.
 * Fields are ordered based on their position in the form.
 *
 * @param {Map<HTMLElement, string>} errors - Map of field → message.
 * @param {Map<string, number>} fieldOrder - Canonical map of field keys to their index in the form.
 * @returns {Map<HTMLElement, string>} New Map with errors sorted according to field order.
 */
export function sortErrors(errors, fieldOrder) {
  return new Map(
    Array.from(errors.entries()).sort(([fieldA], [fieldB]) => {
      const keyA = fieldA.name || fieldA.id || ''
      const keyB = fieldB.name || fieldB.id || ''
      const indexA = fieldOrder.get(keyA) ?? Infinity
      const indexB = fieldOrder.get(keyB) ?? Infinity
      return indexA - indexB
    })
  )
}

/**
 * Build a map of form fields to their index within the form.
 * This provides a canonical order for fields, which is used to sort errors.
 *
 * @param {HTMLFormElement} form - The form element to extract field order from.
 * @returns {Map<string, number>} Map where the key is the field name or id, and the value is its index.
 */
export function getFieldOrder(form) {
  const fields = Array.from(form.elements)
  const order = new Map()

  fields.forEach((field, index) => {
    if (field.name) {
      order.set(field.name, index)
    } else if (field.id) {
      order.set(field.id, index)
    }
  })

  return order
}

/**
 * Binds hover and click behaviors to each summary item.
 *
 * - Hover: temporarily highlights the related form field (if enabled).
 * - Click: scrolls into view and focuses form field (if enabled).
 *
 * @param {HTMLLIElement} li - The summary list item to bind events to.
 * @param {HTMLElement|null} field - The associated form field element, if found.
 * @param {Object} config - Behavior configuration controlling interactivity.
 */
export function bindEvents(li, field, config) {
  // Clear previous bindings
  li.onmouseenter = li.onmouseleave = li.onclick = null

  if (field) {
    // Highlight related field on hover
    if (config.highlightOnHover) {
      li.onmouseenter = () => field.classList.add('suriform-highlight')
      li.onmouseleave = () => field.classList.remove('suriform-highlight')
    }

    // Scroll and focus on click
    if (config.scrollOnClick) {
      li.onclick = () => {
        if (document.activeElement !== field) {
          field.scrollIntoView({ behavior: 'smooth', block: 'center' })
          field.focus({ preventScroll: true })
        }

        // Optional highlight effect
        if (config.highlightOnHover) {
          field.classList.add('suriform-highlight')
          setTimeout(() => field.classList.remove('suriform-highlight'), 1500)
        }
      }
    }
  }
}
