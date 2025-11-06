/**
 * @file rules/alpha.js
 * @description Alpha-related validation rules for Suriform forms.
 */

/**
 * Validate that form field contains only letters (A–Z).
 * Example: <input type="text" alpha />
 * Rejects numbers, spaces, and special characters.
 */
export const alpha = {
  validate: (value) => /^[A-Za-z]+$/.test(value),
  message: 'Must contain letters only.'
}

/**
 * Validate letters, dash, and underscore only.
 * Example: <input type="text" alpha-dash />
 * Rejects numbers, spaces, and other characters.
 */
export const alphaDash = {
  validate: (value) => /^[A-Za-z_-]+$/.test(value),
  message: 'Must contain letters, dashes, or underscores only.'
}

/**
 * Validate alphanumeric characters only (letters and digits).
 * Example: <input type="text" alpha-num />
 * Rejects spaces and special characters.
 */
export const alphaNum = {
  validate: (value) => /^[A-Za-z0-9]+$/.test(value),
  message: 'Must contain letters and numbers only.'
}

/**
 * Validate letters and spaces only.
 * Example: <input type="text" alpha-spaces />
 * Rejects numbers and special characters.
 */
export const alphaSpaces = {
  validate: (value) => /^[A-Za-z\s]+$/.test(value),
  message: 'Must contain letters and spaces only.'
}

/**
 * Validate letters, numbers, and spaces.
 * Example: <input type="text" alpha-num-spaces />
 * Rejects special characters.
 */
export const alphaNumSpaces = {
  validate: (value) => /^[A-Za-z0-9\s]+$/.test(value),
  message: 'Must contain letters, numbers, and spaces only.'
}

/**
 * Grouped alpha rules for easy import
 */
export const alphaRules = {
  alpha,
  alphaDash,
  alphaNum,
  alphaSpaces,
  alphaNumSpaces
}
