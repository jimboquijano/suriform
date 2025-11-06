/**
 * @file tools/message/extendMessage.test.js
 */

import { createFormField, cleanupDocument } from '../../utils/main'
import { extendMessage } from '../../../src/tools/message'

const htmlMap = {
  input: '<input type="text" />'
}

describe('extendMessage()', () => {
  let form

  beforeEach(() => {
    ;({ form } = createFormField(htmlMap.input))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('throws if form is invalid', () => {
    expect(() => extendMessage(null)).toThrow('[SF] extendMessage() requires a valid form element.')
  })

  it('attaches `message controller` to the form', () => {
    const utils = extendMessage(form)
    expect(form.__sfMessage).toBeDefined()
    expect(utils).toHaveProperty('groupMessage')
    expect(utils).toHaveProperty('wrapMessage')
  })
})
