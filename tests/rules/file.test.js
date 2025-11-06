/**
 * @file rules/file.test.js
 * @description Unit tests for file validation rules.
 *
 * Covers: ext, mimes, max-size, min-width, min-height, max-width, max-height.
 * Mocks files and image dimensions to test valid and invalid scenarios.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { makeFileField, cleanupDocument } from '../utils/main'
import { validateField } from '../../src/core/validate'
import { defineRule } from '../../src/suriform'
import { fileRules } from '../../src/rules/file'
import * as domHelper from '../../src/helpers/dom'

describe('File Rules', () => {
  afterEach(() => {
    cleanupDocument()
  })

  const htmlMap = {
    ext: {
      valid: `<input type="file" ext=".jpg,.png" />`,
      invalid: `<input type="file" ext=".jpg,.png" />`,
      validFile: { name: 'image.jpg' },
      invalidFile: { name: 'document.pdf' }
    },
    mimes: {
      valid: `<input type="file" mimes="image/jpeg,image/png" />`,
      invalid: `<input type="file" mimes="image/jpeg,image/png" />`,
      validFile: { type: 'image/png' },
      invalidFile: { type: 'text/plain' }
    },
    maxSize: {
      valid: `<input type="file" max-size="5000" />`,
      invalid: `<input type="file" max-size="5000" />`,
      validFile: { size: 4000 },
      invalidFile: { size: 8000 }
    },
    minWidth: {
      valid: `<input type="file" min-width="100" />`,
      invalid: `<input type="file" min-width="100" />`,
      mockValid: () => vi.spyOn(domHelper, 'loadImage').mockImplementation((f, cb) => cb(200, 200)),
      mockInvalid: () =>
        vi.spyOn(domHelper, 'loadImage').mockImplementation((f, cb) => cb(50, 200)),
      file: { name: 'image.jpg' }
    },
    minHeight: {
      valid: `<input type="file" min-height="100" />`,
      invalid: `<input type="file" min-height="100" />`,
      mockValid: () => vi.spyOn(domHelper, 'loadImage').mockImplementation((f, cb) => cb(200, 200)),
      mockInvalid: () =>
        vi.spyOn(domHelper, 'loadImage').mockImplementation((f, cb) => cb(200, 50)),
      file: { name: 'image.jpg' }
    },
    maxWidth: {
      valid: `<input type="file" max-width="800" />`,
      invalid: `<input type="file" max-width="800" />`,
      mockValid: () => vi.spyOn(domHelper, 'loadImage').mockImplementation((f, cb) => cb(400, 400)),
      mockInvalid: () =>
        vi.spyOn(domHelper, 'loadImage').mockImplementation((f, cb) => cb(1000, 400)),
      file: { name: 'image.jpg' }
    },
    maxHeight: {
      valid: `<input type="file" max-height="800" />`,
      invalid: `<input type="file" max-height="800" />`,
      mockValid: () => vi.spyOn(domHelper, 'loadImage').mockImplementation((f, cb) => cb(400, 400)),
      mockInvalid: () =>
        vi.spyOn(domHelper, 'loadImage').mockImplementation((f, cb) => cb(400, 1000)),
      file: { name: 'image.jpg' }
    }
  }

  for (const [ruleName, rule] of Object.entries(fileRules)) {
    describe(`Rule: ${ruleName}`, () => {
      beforeEach(() => defineRule(ruleName, rule))

      const map = htmlMap[ruleName]
      if (!map) return

      it('passes valid form field', async () => {
        if (map.mockValid) map.mockValid()
        const field = makeFileField(map.valid, map.validFile || map.file)
        const result = await validateField(field)
        expect(result.isValid).toBe(true)
      })

      it('fails invalid form field', async () => {
        if (map.mockInvalid) map.mockInvalid()
        const field = makeFileField(map.invalid, map.invalidFile || map.file)
        const result = await validateField(field)
        expect(result.isValid).toBe(false)
      })
    })
  }
})
