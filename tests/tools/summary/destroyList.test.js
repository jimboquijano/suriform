/**
 * @file tools/summary/destroyList.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { createSummaryContainer, createSummaryList } from '../../../tests/utils/summary'
import { destroyList, createItem } from '../../../src/tools/summary'

const htmlMap = {
  input: '<input type="text" name="email" />'
}

describe('destroyList()', () => {
  let field, wrapper, ul

  beforeEach(() => {
    ;({ field } = createFormField(htmlMap.input))
    ;({ wrapper } = createSummaryContainer())
    ul = createSummaryList([])
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('removes the summary list when `errors` is empty', () => {
    expect(ul).toBeTruthy()

    ul = destroyList(new Map(), wrapper)
    expect(ul).toBeNull()
  })

  it('does not remove the summary list if `errors` is not empty', () => {
    expect(ul).toBeTruthy()

    const errors = new Map()
    createItem(field, 'Invalid input', errors)

    ul = destroyList(errors, wrapper)
    expect(ul).toBeNull()
  })

  it('does nothing if no summary list is found', () => {
    ul.remove()

    destroyList(new Map(), wrapper)
    expect(() => ul).not.toThrow()
  })
})
