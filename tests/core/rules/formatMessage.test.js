/**
 * @file core/rules/formatMessage.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { formatMessage, getContext } from '../../../src/core/rules'
import { defineRule, ruleRegistry } from '../../../src/core/rules'
import { between } from '../../../src/rules'

const htmlMap = {
  between: '<input type="number" between="5,10" />'
}

describe('formatMessage()', () => {
  let field, rule, context

  beforeEach(() => {
    ;({ field } = createFormField(htmlMap.between))

    defineRule('between', between)
    rule = ruleRegistry.between
    context = getContext(field, rule)
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('formats message using positional format array', () => {
    const resolved = 'Must be lower than {min}.'
    const result = formatMessage(resolved, field, rule, context)
    expect(result).toBe('Must be lower than 5.')
  })

  it('formats message using key pair function', () => {
    const resolved = 'Must be between {min} and {max}.'

    rule = {
      ...rule,
      format: () => ({ min: 1, max: 100 })
    }

    const result = formatMessage(resolved, field, rule, context)
    expect(result).toBe('Must be between 1 and 100.')
  })

  it('applies group overrides when `resolvedMessage` is an object', () => {
    const resolved = {
      message: 'Value must be {foo}.',
      format: () => ({ foo: 'bar' })
    }

    const result = formatMessage(resolved, field, rule, context)
    expect(result).toBe('Value must be bar.')
  })

  it('uses default message when `resolvedMessage` is a string', () => {
    const resolved = 'Must be between {min} and {max}.'
    const result = formatMessage(resolved, field, rule, context)
    expect(result).toBe('Must be between 5 and 10.')
  })
})
