/**
 * @file tools/popup.js
 * @description Suriform utility for handling popup-based validation feedback.
 *
 * Provides floating, accessible error popups that appear near invalid fields
 * without altering form markup. Handles creation, positioning, and cleanup
 * automatically to ensure polished and consistent Suriform feedback behavior.
 */

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Initializes popup-based validation feedback for a Suriform form.
 *
 * Automatically positions, updates, and removes popup elements when validation
 * messages appear or fields regain validity. Supports smooth repositioning on
 * scroll and resize events to maintain alignment and visual consistency.
 *
 * @param {HTMLFormElement} form - The form element to attach the popup.
 * @param {object} [options] - Optional configuration for popup behavior.
 * @param {boolean} [options.displaySingle=true] - If `true`, tracks the first invalid.
 * @returns {object} The popup control interface.
 * @throws {TypeError} If `form` is not a valid <form> element.
 */
export function withPopup(form, options = {}) {
  if (!(form instanceof HTMLFormElement)) {
    throw new Error('[SF] withPopup() requires a valid form element.')
  }

  // Merge user options with defaults
  const config = {
    displaySingle: true,
    ...options
  }

  // Stores all active errors
  const popups = new Map()

  // Throttle scroll/resize repositioning
  let frameRequested = false

  /**
   * Throttles repositioning of all popups to a single animation frame.
   *
   * Prevents multiple rapid calls to `positionPopup()` from causing
   * layout thrashing. Only one reposition occurs per animation frame,
   * even if triggered repeatedly by scroll, resize, or DOM changes.
   */
  function positionErrors() {
    if (frameRequested) return
    frameRequested = true

    // Schedule a single animation frame to update all popup positions
    requestAnimationFrame(() => {
      frameRequested = false

      for (const [field, wrapper] of popups.entries()) {
        positionPopup(field, wrapper)
      }
    })
  }

  /**
   * Displays a popup message anchored to a given form field.
   *
   * Handles creation, positioning, and event binding for error popups.
   * Respects smart tracking rules if enabled. Reuses an existing popup
   * if already present to avoid flicker and maintain smooth animations.
   *
   * @param {HTMLElement} field - The target form field.
   * @param {string} message - Validation message to display.
   */
  function addError(field, message) {
    if (!isValidField(field, form)) return

    // Reposition for page height change
    positionErrors()

    if (config.displaySingle) {
      if (notFirstInvalid(field)) return

      // Hide all if needed
      removeErrors(field)
    }

    // Create a new popup and attach to the DOM
    const wrapper = createWrapper(field, message, popups)

    // Bind outside click/focus and dynamic repositioning
    bindEvents(wrapper, positionErrors)
    outsideClose(field, removeError)

    // Initial popup positioning
    positionPopup(field, wrapper)

    // Attach visibility observer
    wrapper.__sfVisibility = observeVisibility(field, removeError)
  }

  /**
   * Hides and removes the popup linked to a given form field.
   *
   * Cleans up DOM nodes and event listeners to prevent memory leaks.
   * Supports smart tracking: optionally displays the nearest invalid field
   * after hiding the current popup.
   *
   * @param {HTMLElement} field - The form field whose popup should be hidden.
   */
  function removeError(field) {
    if (!isValidField(field, form)) return

    // Reposition for page height change
    positionErrors()

    // Remove popup DOM and event listeners
    cleanupPopup(field, popups)

    // Show nearest invalid field
    if (config.displaySingle) {
      requestAnimationFrame(() => {
        if (popups.size == 0) {
          showFirstInvalid(field, addError)
        }
      })
    }
  }

  /**
   * Displays a provided list of popup validation errors.
   *
   * Replaces all existing popups with the given array of error objects,
   * each containing a `field` (HTMLElement) and a `message` (string).
   * Triggers a full re-render of all active popup messages.
   *
   * @param {Array<{field: HTMLElement, message: string}>} newErrors - Array of error entries to display.
   */
  function addErrors(newErrors) {
    if (!Array.isArray(newErrors)) {
      throw new Error('[SF] addErrors() requires an array of { field, message } objects.')
    }

    // Clear popups
    removeErrors()

    // Display popups and stop at first if needed
    for (const { field, message } of newErrors) {
      addError(field, message)
      if (config.displaySingle) break
    }
  }

  /**
   * Hides all active popups except the one tied to the specified form field.
   *
   * Ensures only the relevant popup remains visible to avoid overlap or
   * confusion when multiple fields are invalid simultaneously.
   *
   * @param {HTMLElement} [exceptField] - Optional form field whose popup should remain visible.
   */
  function removeErrors(exceptField) {
    for (const field of popups.keys()) {
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
 * Finds the first invalid form field, if none are currently focused.
 *
 * Scans the form for a field associated with an inline error element
 * via the `aria-describedby` attribute. Returns the field only when
 * the form has no focused input, ensuring user focus isn't interrupted.
 *
 * @param {HTMLFormElement} form - The form to search within.
 * @returns {HTMLElement|null} The first invalid field, or null if none found or a field is focused.
 */
export function getFirstInvalid(form) {
  const field = form.querySelector('[aria-describedby]')
  if (!(field instanceof HTMLElement)) return null

  // Verify that the referenced error element actually exists
  const describedId = field.getAttribute('aria-describedby')
  const error = describedId ? document.getElementById(describedId) : null

  // Return the field only if the associated error element exists
  return error instanceof HTMLElement ? field : null
}

/**
 * Show the popup for the first invalid field in the form.
 *
 * Skips a specific field if provided (e.g., one that was just hidden).
 * Optionally invokes a callback with the invalid field and message.
 * Safe to call even if no invalid fields exist or popup text is missing.
 *
 * @param {HTMLElement} [field] - A field to skip (e.g., recently hidden one).
 * @param {Function} [addError] - Show error function to call with (field, message).
 */
export function showFirstInvalid(field, addError) {
  const firstInvalid = getFirstInvalid(field.form)
  if (!firstInvalid || firstInvalid === field) return

  const descId = firstInvalid.getAttribute('aria-describedby')
  if (!descId) return

  const descEl = document.getElementById(descId)
  if (!descEl || !descEl.textContent) return

  const message = descEl.textContent.trim()
  addError(firstInvalid, message)
}

/**
 * Determines whether a popup should be skipped due to displaySingle rules.
 *
 * Only the first invalid field should display a popup. Any subsequent
 * invalid fields are temporarily ignored until the first one is corrected.
 *
 * @param {HTMLElement} field - The candidate field to potentially show a popup.
 * @returns {boolean} True if the popup display should be skipped for this field.
 */
export function notFirstInvalid(field) {
  if (field === document.activeElement) return false

  // Skip if this field is not the first invalid
  const firstInvalid = getFirstInvalid(field.form)
  return firstInvalid && firstInvalid !== field
}

/**
 * Creates a new popup wrapper element for a field and attaches it to the DOM.
 *
 * The wrapper is stored in a WeakMap for tracking active popups. The popup
 * element itself is styled and positioned absolutely by default.
 *
 * @param {HTMLElement} field - The field the popup is associated with.
 * @param {string} message - The validation message to display.
 * @param {WeakMap} popups - Map storing active popups for each field.
 * @returns {HTMLElement} The newly created popup wrapper element.
 */
export function createWrapper(field, message, popups) {
  let wrapper = popups.get(field)

  // Update popup then return right away
  if (wrapper) {
    updateExisting(wrapper, message, field)
    return wrapper
  }

  // Create the wrapper and initial styles
  wrapper = document.createElement('div')
  wrapper.className = 'suriform-popup-wrapper'
  Object.assign(wrapper.style, {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 1000
  })

  // Inner popup element carrying the visible message
  const popup = document.createElement('div')
  popup.className = 'suriform-error-popup'
  popup.textContent = message

  applyStyles(popup)
  wrapper.appendChild(popup)

  document.body.appendChild(wrapper)
  popups.set(field, wrapper)
  return wrapper
}

/**
 * Binds event listeners for outside clicks/focus and dynamic repositioning.
 *
 * Ensures the popup closes when the user clicks outside it or the field,
 * while also keeping the popup correctly positioned during scroll/resize.
 *
 * @param {HTMLElement} field - The field the popup is anchored to.
 * @param {HTMLElement} wrapper - The popup wrapper element.
 * @param {Function} removeError - Function to hide the popup.
 * @param {Function} positionErrors - Reposition callback to adjust remaining popups.
 */
export function bindEvents(wrapper, positionErrors) {
  if (wrapper.__sfReposition) return

  // Keep popup dynamically positioned when viewport changes
  wrapper.__sfReposition = positionErrors
  window.addEventListener('scroll', wrapper.__sfReposition, true)
  window.addEventListener('resize', wrapper.__sfReposition)
}

/**
 * Cleans up popup DOM and associated event listeners.
 *
 * Removes the wrapper from the DOM, detaches scroll/resize listeners,
 * and clears the popup entry from the WeakMap to prevent memory leaks.
 *
 * @param {HTMLElement} field - The form field tied to the popup.
 * @param {WeakMap} popups - Map storing active popups.
 */
export function cleanupPopup(field, popups) {
  let wrapper = popups.get(field)
  if (!wrapper) return

  // Detach scroll/resize listeners if present
  if (wrapper.__sfReposition) {
    window.removeEventListener('scroll', wrapper.__sfReposition, true)
    window.removeEventListener('resize', wrapper.__sfReposition)
    delete wrapper.__sfReposition
  }

  // Disconnect visibility observer
  if (wrapper.__sfVisibility) {
    wrapper.__sfVisibility.disconnect()
    delete wrapper.__sfVisibility
  }

  // Remove the popup element from the DOM
  wrapper.remove()

  // Remove the popup from the WeakMap
  popups.forEach((value, key) => {
    if (value === wrapper) popups.delete(key)
  })
}

/**
 * Closes the popup when focus or clicks occur outside it.
 *
 * Adds capture-phase listeners that automatically call `removeError()`
 * when interaction happens outside the form field or popup. Ignores clicks
 * on submit buttons to prevent flicker during repeated submissions.
 *
 * @param {HTMLElement} field - The form field tied to the popup.
 * @param {Function} removeError - Cleanup function from usePopup.
 */
export function outsideClose(field, removeError) {
  const hideOnOutside = (e) => {
    const target = e.target

    // Ignore clicks on submit buttons (prevents flicker on repeated submit)
    if (target instanceof HTMLButtonElement && target.type === 'submit') return

    // Ignore clicks on the form itself
    if (field.form && field.form.contains(target)) return

    removeError(field)
    document.removeEventListener('click', hideOnOutside, true)
    document.removeEventListener('focusin', hideOnOutside, true)
  }

  // Small defer to avoid catching the creation click
  setTimeout(() => {
    document.addEventListener('click', hideOnOutside, true)
    document.addEventListener('focusin', hideOnOutside, true)
  }, 0)
}

/**
 * Positions the popup directly beneath its form field.
 *
 * Calculates screen coordinates using the form field’s bounding box
 * and adjusts placement relative to scroll offsets. Also resizes
 * the popup width dynamically to match the form field’s width.
 *
 * @param {HTMLElement} field - The target form field.
 * @param {HTMLElement} wrapper - Popup wrapper to position.
 */
export function positionPopup(field, wrapper) {
  const rect = field?.getBoundingClientRect?.()
  if (!rect) return

  // Adjust popup position relative to viewport and scroll offset
  wrapper.style.left = `${rect.left + window.scrollX}px`
  wrapper.style.top = `${rect.bottom + window.scrollY + 4}px`

  // Dynamically match popup width to form field width
  const fieldWidth = rect.width
  wrapper.firstElementChild.style.maxWidth = `${Math.max(fieldWidth, 180)}px`
}

/**
 * Update message and position for an already-visible popup.
 *
 * Ensures that the popup’s text content stays current without removing or
 * recreating its DOM node — avoiding flicker and keeping animations intact.
 * Also repositions the popup to align with any layout changes.
 *
 * @param {HTMLElement} wrapper - Existing popup wrapper element.
 * @param {string} message - New validation message to display.
 * @param {HTMLElement} field - Related form field for positioning.
 */
export function updateExisting(wrapper, message, field) {
  const popup = wrapper.firstElementChild

  if (popup && popup.textContent !== message) {
    popup.textContent = message
  }

  positionPopup(field, wrapper)
}

/**
 * Observes the visibility of the form containing a field and removes the
 * popup if the form is no longer visible (e.g., hidden tab).
 *
 * @param {HTMLElement} field - The form field whose popup should be monitored.
 * @param {Function} removeError - Callback to remove the popup.
 * @returns {IntersectionObserver} Observer instance to disconnect later.
 */
function observeVisibility(field, removeError) {
  const form = field.form
  if (!form) return null

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          removeError(field)
        }
      })
    },
    { root: null, threshold: 0 }
  )

  observer.observe(form)
  return observer
}

/**
 * Applies consistent Suriform popup styling.
 *
 * @param {HTMLElement} el - Popup element to style.
 */
export function applyStyles(el) {
  Object.assign(el.style, {
    position: 'relative',
    pointerEvents: 'none',
    border: '1px solid #000',
    borderLeft: '3px solid #d8000c',
    background: '#fff',
    color: '#000',
    padding: '10px',
    borderRadius: '4px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    opacity: '1',
    display: 'inline-block',
    boxSizing: 'border-box',
    fontSize: '14px',
    fontFamily: 'system-ui, sans-serif',
    boxShadow: '5px 8px 16px rgba(0, 0, 0, 0.3)',
    transform: 'translateY(0)',
    zIndex: 1000
  })
}

/* -------------------------------------------------------------------------- */
/* One-time Arrow Style Injection                                             */
/* -------------------------------------------------------------------------- */

/**
 * Injects reusable arrow CSS for all Suriform popups.
 * Executed once per page to style popup pointers.
 */
;(function injectArrowStyle() {
  if (typeof document === 'undefined') return
  if (document.getElementById('suriform-popup-arrow-style')) return

  const style = document.createElement('style')
  style.id = 'suriform-popup-arrow-style'
  style.textContent = `
    .suriform-error-popup::before {
      content: '';
      position: absolute;
      top: -14px;
      left: 11px;
      border-width: 7px;
      border-style: solid;
      border-color: transparent transparent #000 transparent;
      z-index: -1;
    }

    .suriform-error-popup::after {
      content: '';
      position: absolute;
      top: -12px;
      left: 12px;
      border-width: 6px;
      border-style: solid;
      border-color: transparent transparent #fff transparent;
    }
  `
  document.head.appendChild(style)
})()
