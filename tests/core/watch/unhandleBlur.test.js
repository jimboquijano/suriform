/**
 * @file core/watch/unhandleBlur.test.js
 */

import { describe, it, expect } from 'vitest'
import { createFormField } from '../../utils/main'
import { handleBlur, unhandleBlur } from '../../../src/core/watch'

describe('unhandleBlur()', () => {
  it('removes the blur listener from the form', () => {
    const { form } = createFormField('<input type="text" />')
    handleBlur(form, { validateOnBlur: true })

    expect(form.__sfBlur).toBeDefined()
    unhandleBlur(form)
    expect(form.__sfBlur).toBeUndefined()
  })

  it('does nothing if no listener exists', () => {
    const { form } = createFormField('<input type="text" />')
    expect(() => unhandleBlur(form)).not.toThrow()
  })
})
