/**
 * @file tools/summary/getFieldOrder.test.js
 */

import { describe, it, expect } from 'vitest'
import { createFormField } from '../../utils/main'
import { getFieldOrder } from '../../../src/tools/summary'

const htmlMap = {
  inputs: `
	<input type="text" name="alpha" />
	<input type="text" id="beta" />
  `
}

describe('getFieldOrder()', () => {
  it('maps fields by name or id in form order', () => {
    const { form } = createFormField(htmlMap.inputs)
    const map = getFieldOrder(form)

    expect(Array.from(map.entries())).toEqual([
      ['alpha', 0],
      ['beta', 1]
    ])
  })
})
