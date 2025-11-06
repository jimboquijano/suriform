/**
 * @file core/validate/checkFieldValidity.test.js
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { checkFieldValidity } from '../../../src/core/validate'
import { defineRules } from '../../../src/core/rules'
import { min, max, match } from '../../../src/rules'
import * as rulesModule from '../../../src/core/rules'

const htmlMap = {
  inputs: `
    <input type="number" min="5" max="10" value="6" />
	<input type="number" min="5" max="10" value="4" />
  `
}

const failResult = {
  isValid: false,
  message: 'Value must be greater than or equal to 5.'
}

const passResult = {
  isValid: true,
  message: ''
}

describe('checkFieldValidity()', () => {
  let field, field2

  beforeEach(() => {
    ;({ field, field2 } = createFormField(htmlMap.inputs))
  })

  afterEach(() => {
    cleanupDocument()
    vi.clearAllMocks()
  })

  it('returns valid when no rules apply', async () => {
    const result = await checkFieldValidity(field2)

    expect(result).toEqual(passResult)
  })

  it('returns invalid with the first rule error', async () => {
    defineRules({ min, max })

    const spyValidateRule = vi.spyOn(rulesModule, 'validateRule')
    const result = await checkFieldValidity(field2)

    expect(result).toEqual(failResult)
    expect(spyValidateRule).toHaveBeenCalledTimes(1)
  })

  it('returns valid if all rules pass', async () => {
    defineRules({ min, max })

    const spyValidateRule = vi.spyOn(rulesModule, 'validateRule')
    const result = await checkFieldValidity(field)

    expect(result).toEqual(passResult)
    expect(spyValidateRule).toHaveBeenCalledTimes(2)
  })

  it('stops at the first failing rule even if multiple fail', async () => {
    defineRules({ min, match })

    const spyValidateRule = vi.spyOn(rulesModule, 'validateRule')
    const result = await checkFieldValidity(field2)

    expect(result).toEqual(failResult)
    expect(spyValidateRule).toHaveBeenCalledTimes(1)
  })
})
