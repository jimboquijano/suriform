/**
 * @file rules/date.js
 * @description Date validation rules for Suriform forms.
 */

import { formatDate } from '../helpers/format'

/**
 * Validate that form field date is before a reference date.
 * Example: <input type="date" date-before="targetDate" />
 */
export const dateBefore = {
  validate: (value, [target], { form, type }) => {
    if (type !== 'date') return true

    const date = formatDate(value)
    const refDate = formatDate(form[target])

    return !(date && refDate && date >= refDate)
  },
  format: (_, [target], { form }) => {
    return { date: form[target] }
  },
  checksTarget: true,
  message: 'Date must be before {date}.'
}

/**
 * Validate that form field date is after a reference date.
 * Example: <input type="date" date-after="targetDate" />
 */
export const dateAfter = {
  validate: (value, [target], { form, type }) => {
    if (type !== 'date') return true

    const date = formatDate(value)
    const refDate = formatDate(form[target])

    return !(date && refDate && date <= refDate)
  },
  format: (_, [target], { form }) => {
    return { date: form[target] }
  },
  checksTarget: true,
  message: 'Date must be after {date}.'
}

/**
 * Validate that form field date is between two dates.
 * Example: <input type="date" date-between="2021-01-01,2021-12-31" />
 */
export const dateBetween = {
  validate: (value, [startDate, endDate], { type }) => {
    if (type !== 'date') return true

    const date = formatDate(value)
    const start = formatDate(startDate)
    const end = formatDate(endDate)

    if (!date || !start || !end) return true
    return date >= start && date <= end
  },
  format: (_, [startDate, endDate]) => {
    return { startDate, endDate }
  },
  message: 'Date must be between {startDate} and {endDate}.'
}

/**
 * Validate that form field date is on or after a minimum date.
 * Example: <input type="date" min-date="2020-01-01" />
 */
export const minDate = {
  validate: (value, [minDate], { type }) => {
    if (type !== 'date') return true

    const date = formatDate(value)
    const min = formatDate(minDate)

    if (!date || !min) return true
    return date >= min
  },
  message: 'Date must be on or after {date}.'
}

/**
 * Validate that form field date is on or before a maximum date.
 * Example: <input type="date" max-date="2020-01-01" />
 */
export const maxDate = {
  validate: (value, [maxDate], { type }) => {
    if (type !== 'date') return true

    const valDate = formatDate(value)
    const max = formatDate(maxDate)

    if (!valDate || !max) return true
    return valDate <= max
  },
  message: 'Date must be on or before {date}.'
}

/**
 * Grouped date rules for easy import
 */
export const dateRules = {
  dateBefore,
  dateAfter,
  dateBetween,
  minDate,
  maxDate
}
