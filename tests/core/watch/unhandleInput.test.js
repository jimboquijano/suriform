/**
 * @file core/watch/unhandleInput.test.js
 */

import { describe, it, expect } from 'vitest'
import { createFormField } from '../../utils/main'
import { handleInput, unhandleInput } from '../../../src/core/watch'

describe('unhandleInput()', () => {
  it('removes the input listener from the form', () => {
    const { form } = createFormField('<input type="text" />')
    handleInput(form, { validateOnInput: true })

    expect(form.__sfInput).toBeDefined()
    unhandleInput(form)
    expect(form.__sfInput).toBeUndefined()
  })

  it('does nothing if no listener exists', () => {
    const { form } = createFormField('<input type="text" />')
    expect(() => unhandleInput(form)).not.toThrow()
  })
})
