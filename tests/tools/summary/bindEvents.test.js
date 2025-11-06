/**
 * @file tools/summary/bindEvents.test.js
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { createSummaryList } from '../../utils/summary'
import { bindEvents } from '../../../src/tools/summary'

const htmlMap = {
  input: '<input type="text" />'
}

const options = {
  main: {
    highlightOnHover: true,
    scrollOnClick: true
  },
  scroll: {
    behavior: 'smooth',
    block: 'center'
  },
  focus: {
    preventScroll: true
  }
}

describe('bindEvents()', () => {
  let ul, field

  beforeEach(() => {
    ;({ field } = createFormField(htmlMap.input))

    field.scrollIntoView = vi.fn()
    field.focus = vi.fn()
    ul = createSummaryList()
  })

  afterEach(() => {
    cleanupDocument()
  })

  it('binds hover and click events to list items', () => {
    const li = ul.children[0]
    bindEvents(li, field, options.main)

    li.onmouseenter()
    expect(field.classList.contains('suriform-highlight')).toBe(true)

    li.onmouseleave()
    expect(field.classList.contains('suriform-highlight')).toBe(false)

    li.onclick()
    expect(field.scrollIntoView).toHaveBeenCalledWith(options.scroll)
    expect(field.focus).toHaveBeenCalledWith(options.focus)
    expect(field.classList.contains('suriform-highlight')).toBe(true)
  })

  it('ignores items with missing form field references', () => {
    const li = ul.children[0]
    li.dataset.fieldName = 'unknown'

    expect(() => bindEvents(li, field, options.main)).not.toThrow()
  })
})
