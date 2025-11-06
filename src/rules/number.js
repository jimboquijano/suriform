/**
 * @file rules/number.js
 * @description Numeric and integer validation rules for Suriform forms.
 */

/**
 * Validate that form field value is an integer.
 * Example: <input type="text" integer />
 * Rejects decimals and non-numeric values.
 */
export const integer = {
  validate: (value) => /^-?\d+$/.test(value),
  message: 'Must be an integer.'
}

/**
 * Validate that form field value is numeric.
 * Example: <input type="text" numeric />
 * Rejects letters and special characters.
 */
export const numeric = {
  validate: (value) => !isNaN(value),
  message: 'Must be a number.'
}

/**
 * Validate that form field value has exact number of digits.
 * Example: <input type="text" digits="5" />
 */
export const digits = {
  validate: (value, [digits]) => new RegExp(`^\\d{${digits}}$`).test(value),
  message: 'Must be exactly {count} digits.'
}

/**
 * Validate that form field value is between min and max.
 * Example: <input type="text" between="3,10" />
 */
export const between = {
  validate: (value, [min, max]) => {
    value = Number(value)
    if (isNaN(value)) return true
    return value >= min && value <= max
  },
  format: (_, [min, max]) => {
    return { min, max }
  },
  message: 'Must be between {min} and {max}.'
}

/**
 * Grouped number rules for easy import
 */
export const numberRules = {
  integer,
  numeric,
  digits,
  between
}
