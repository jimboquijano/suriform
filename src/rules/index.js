/**
 * @file rules/index.js
 * @description Central exports for all Suriform validation rules and messages.
 *
 * Responsibilities:
 * - Exposes grouped rule objects per category
 * - Exposes messages per category
 * - Provides `allRules` combining all rules except required ones
 * - No registration functions; purely for ESM import
 */

export * from './alpha'
export * from './compare'
export * from './date'
export * from './file'
export * from './select'
export * from './native'
export * from './number'
export * from './required'
export * from './string'

/**
 * Combined all rules except required ones
 */
import { alphaRules } from './alpha'
import { compareRules } from './compare'
import { dateRules } from './date'
import { fileRules } from './file'
import { selectRules } from './select'
import { nativeRules } from './native'
import { numberRules } from './number'
import { requiredRules } from './required'
import { stringRules } from './string'

/**
 * Expose every single built-in rule
 */
export const allRules = {
  ...alphaRules,
  ...compareRules,
  ...dateRules,
  ...fileRules,
  ...selectRules,
  ...nativeRules,
  ...numberRules,
  ...requiredRules,
  ...stringRules
}
