/**
 * @file helpers/format.js
 * @description Formatting and display utilities for Suriform.
 *
 * Offers human-readable formatting, file size conversion, and
 * HTML escaping functions for consistent rendering across forms.
 */

/**
 * Format an array of strings into a human-readable list.
 *
 * 1. Joins array items with commas and adds 'and' before the last element.
 * 2. Handles arrays of length 0, 1, 2, or more.
 * 3. Useful for displaying validation messages or lists in UI.
 *
 * @param {Array<string>} arr - Array of strings to format.
 * @returns {string} Human-readable list string.
 *
 * @example
 * formatList(['apple', 'banana', 'orange']) // → 'apple, banana, and orange'
 */
export const formatList = (arr) => {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`

  return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1]
}

/**
 * Convert bytes to a human-readable file size.
 *
 * 1. Converts a number of bytes into KB, MB, GB, or TB.
 * 2. Rounds the result to 1 decimal place.
 * 3. Returns a string with the numeric value and unit.
 * 4. Useful for file size validation messages or display.
 *
 * @param {number} bytes - File size in bytes.
 * @returns {string} Formatted size string.
 *
 * @example
 * formatFileSize(10240) // → '10 KB'
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} bytes`

  const units = ['KB', 'MB', 'GB', 'TB']
  let size = bytes / 1024
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${Math.round(size * 10) / 10} ${units[unitIndex]}`
}

/**
 * Escape HTML entities for safe display.
 *
 * 1. Converts &, <, >, ", and ' characters into HTML entities.
 * 2. Prevents XSS vulnerabilities when rendering dynamic content.
 * 3. Can be used for inline messages or any user-supplied text.
 *
 * @param {string} str - The string to escape.
 * @returns {string} Escaped string safe for HTML.
 *
 * @example
 * escapeHtml('<div>') // → '&lt;div&gt;'
 */
export function escapeHtml(str) {
  const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(str).replace(/[&<>"']/g, (m) => htmlEntities[m])
}

/**
 * Safely parse a string into a Date object.
 *
 * 1. Accepts ISO-like or valid date strings.
 * 2. Returns a Date object if parsing succeeds.
 * 3. Returns null for empty strings or invalid dates.
 * 4. Ensures consistent date handling across Suriform validation rules.
 *
 * @param {string} str - The string to parse as a date.
 * @returns {Date|null} Parsed Date object or null if invalid.
 *
 * @example
 * formatDate('2025-10-07') // → Date object
 * formatDate('')           // → null
 */
export function formatDate(str) {
  if (typeof str !== 'string' || !str.trim()) return null
  const date = new Date(str)

  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Parse parameters for a rule from a field attribute.
 *
 * 1. Split comma-separated entries and filter out empty strings.
 * 2. Convert each value to the proper type: boolean, number, or string.
 *
 * @param {string} attrValue - The value from the attribute name.
 * @returns {Array<any>} Parsed parameters.
 *
 * @example
 * splitParams('5,10,true') // → [5,10,true]
 * splitParams('')          // → []
 */
export function splitParams(attrValue) {
  if (!attrValue) return []

  // Split comma-separated values
  const parts = attrValue
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

  // Convert strings to numbers/booleans if possible
  const parsed = parts.map((v) => {
    if (v === 'true') return true
    if (v === 'false') return false
    const num = Number(v)
    return isNaN(num) ? v : num
  })

  return parsed
}
