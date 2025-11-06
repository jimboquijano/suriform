/**
 * @file core/error/getTemplate.test.js
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from '../../utils/main'
import { getTemplate } from '../../../src/core/error'

const htmlMap = {
  input: '<input type="text" />',
  custom: '<div>custom error</div>'
}

describe('getTemplate()', () => {
  let field, form

  beforeEach(() => {
    ;({ field, form } = createFormField(htmlMap.input))
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('returns the `wrap handler` when valid', () => {
    form.__sfMessage = {
      wrap: () => htmlMap.custom
    }

    const result = getTemplate(field, 'some error')
    expect(result).toBe(htmlMap.custom)
  })

  it('falls back to escaped string if the `wrap handler` returns non-string', () => {
    form.__sfMessage = {
      wrap: () => 123
    }

    const result = getTemplate(field, 'fallback error')
    expect(result).toContain('fallback error')
  })

  it('falls back to escaped string if the `wrap handler` does not exist', () => {
    const result = getTemplate(field, 'fallback error')
    expect(result).toContain('fallback error')
  })
})
