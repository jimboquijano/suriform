/**
 * @file tools/summary/getContainer.test.js
 */

import { describe, it, expect, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { createSummaryContainer } from '../../utils/summary'
import { getContainer } from '../../../src/tools/summary'

const htmlMap = {
  input: '<input type="text" />'
}

describe('getContainer()', () => {
  afterEach(() => {
    cleanupDocument
  })

  it('returns null if input is not an HTMLElement', () => {
    expect(getContainer(null)).toBeNull()
    expect(getContainer({})).toBeNull()
  })

  it('returns container if not a <form>', () => {
    const div = document.createElement('div')
    expect(getContainer(div)).toBe(div)
  })

  it('creates wrapper div for form if not existing', () => {
    const { form } = createFormField(htmlMap.input)
    const wrapper = getContainer(form)

    expect(wrapper.classList.contains('suriform-summary-wrapper')).toBe(true)
    expect(form.previousElementSibling).toBe(wrapper)
  })

  it('reuses existing wrapper if already present', () => {
    const { form, wrapper } = createSummaryContainer()
    const result = getContainer(form)
    expect(result).toBe(wrapper)
  })
})
