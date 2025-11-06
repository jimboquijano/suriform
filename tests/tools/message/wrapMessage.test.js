/**
 * @file tools/message/wrapMessage.test.js
 */

import { createFormField, cleanupDocument } from '../../utils/main'
import { extendMessage } from '../../../src/tools/message'

const htmlMap = {
  input: '<input type="text" />'
}

describe('wrapMessage()', () => {
  let form

  beforeEach(() => {
    ;({ form } = createFormField(htmlMap.input))
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('applies custom transformation via callback', () => {
    const { wrapMessage } = extendMessage(form)
    wrapMessage(({ message }) => `**${message}**`)

    const result = form.__sfMessage.wrap({ message: 'Hello' })
    expect(result).toBe('**Hello**')
  })

  it('returns undefined if callback returns undefined', () => {
    const { wrapMessage } = extendMessage(form)
    wrapMessage(() => undefined)

    const result = form.__sfMessage.wrap({ message: 'Keep me' })
    expect(result).toBeUndefined()
  })

  it('catches and logs errors from callback', () => {
    const { wrapMessage } = extendMessage(form)
    const error = new Error('test error')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapMessage(() => {
      throw error
    })

    form.__sfMessage.wrap({ message: 'ignored' })
    expect(consoleSpy).toHaveBeenCalledWith('[SF] Error in wrapMessage() callback:', error)

    consoleSpy.mockRestore()
  })
})
