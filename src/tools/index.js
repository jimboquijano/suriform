/**
 * @file tools/index.js
 * @description Central export hub for all Suriform tool modules.
 *
 * Aggregates utilities for dynamic forms, validation feedback,
 * and enhanced form field interactions into a single, cohesive API.
 */

import { useValidity, useAjax } from './hooks'
import { extendMessage } from './message'
import { handleErrors } from './errors'
import { firstError } from './errors'
import { watchTarget } from './target'
import { withSummary } from './summary'
import { withPopup } from './popup'

/**
 * Expose all core Suriform tool APIs for global or modular use.
 */
export {
  useValidity,
  useAjax,
  extendMessage,
  handleErrors,
  firstError,
  watchTarget,
  withSummary,
  withPopup
}
