/**
 * @file core/error/showError.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { showError } from '../../../src/core/error'

const htmlMap = {
  input: '<input type="text" />'
}

describe('showError()', () => {
  let field, form

  beforeEach(() => {
    ;({ field, form } = createFormField(htmlMap.input))

    form.__sfError = {
      _emit: vi.fn()
    }
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('creates a new error element', () => {
    showError(field, 'some error')
    const errorEl = field.nextElementSibling

    expect(errorEl).toBeInstanceOf(HTMLElement)
    expect(errorEl.classList.contains('suriform-error')).toBe(true)
    expect(errorEl.textContent).toContain('some error')
  })

  it('sets ARIA attributes', () => {
    showError(field, 'some error')

    expect(field.getAttribute('aria-invalid')).toBe('true')
    expect(field.getAttribute('aria-describedby')).toBeDefined()
  })

  it('updates existing error content if already present', () => {
    showError(field, 'some error')
    const errorId = field.getAttribute('aria-describedby')

    showError(field, 'updated error')
    const errorEl = document.getElementById(errorId)
    expect(errorEl.textContent).toBe('updated error')
  })
})
