/**
 * @file tools/message/groupMessage.test.js
 */

import { createFormField, cleanupDocument } from '../../utils/main'
import { extendMessage } from '../../../src/tools/message'

const htmlMap = {
  minMax: '<input type="text" min="5" max="10" />'
}

describe('groupMessage()', () => {
  let form, field

  beforeEach(() => {
    ;({ form, field } = createFormField(htmlMap.minMax))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('sets a `group handler` that returns the shared message', () => {
    const { groupMessage } = extendMessage(form)

    groupMessage({
      rules: ['min', 'max'],
      message: 'Value must be between limits.'
    })

    const result = form.__sfMessage.group({ field, attr: 'min' })

    expect(result).toEqual({
      message: 'Value must be between limits.',
      params: ['5', '10'],
      format: ['min', 'max']
    })
  })

  it('returns false when `ruleName` is not included', () => {
    const { groupMessage } = extendMessage(form)

    groupMessage({
      rules: ['min', 'max'],
      message: 'Value must be between limits.'
    })

    const result = form.__sfMessage.group({ field, attr: 'pattern' })
    expect(result).toBe(false)
  })
})
