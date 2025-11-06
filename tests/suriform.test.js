import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFormField, cleanupDocument } from './utils/main'
import { validateForm, resetForm } from '../src/core/validate'
import { defineRules, defineRule } from '../src/core/rules'
import { localize, setLocale } from '../src/core/i18n'
import * as validateModule from '../src/core/validate'
import * as watchModule from '../src/core/watch'
import { watchForm } from '../src/suriform'

const htmlMap = {
  input: `
    <input type="text" required />
    <input type="text" />
  `
}
/**
 * Creates spies for all Suriform watch handlers and unhandlers.
 * Used to track if event bindings are correctly attached or removed.
 *
 * @returns {Object} - Object containing all watch handler spies.
 */
const createWatchSpies = () => ({
  handleSubmit: vi.spyOn(watchModule, 'handleSubmit'),
  handleInput: vi.spyOn(watchModule, 'handleInput'),
  handleBlur: vi.spyOn(watchModule, 'handleBlur'),
  unhandleSubmit: vi.spyOn(watchModule, 'unhandleSubmit'),
  unhandleInput: vi.spyOn(watchModule, 'unhandleInput'),
  unhandleBlur: vi.spyOn(watchModule, 'unhandleBlur')
})

/**
 * Asserts that all handler spies were called with the expected form.
 * Optionally checks a specific handler type (`handle` or `unhandle`).
 *
 * @param {Object} spies - Object of spies returned by createWatchSpies.
 * @param {HTMLFormElement} form - The form element passed to watchForm.
 * @param {'handle'|'unhandle'} [type='handle'] - Type of handler to check.
 */
const expectHandlersCalledWithForm = (spies, form, type = 'handle') => {
  const keys = ['Submit', 'Input', 'Blur']

  for (const key of keys) {
    const fn = spies[`${type}${key}`]
    expect(fn).toHaveBeenCalledWith(form, expect.any(Object))
  }
}

/**
 * Asserts that all unhandler spies were called with the expected form.
 * Used to verify disconnect and cleanup operations.
 *
 * @param {Object} spies - Object of spies returned by createWatchSpies.
 * @param {HTMLFormElement} form - The form element to check.
 */
const expectUnhandlersCalledWithForm = (spies, form) => {
  const keys = ['Submit', 'Input', 'Blur']

  for (const key of keys) {
    const fn = spies[`unhandle${key}`]
    expect(fn).toHaveBeenCalledWith(form)
  }
}

describe('watchForm()', () => {
  let form

  beforeEach(() => {
    ;({ form } = createFormField(htmlMap.input))
  })

  afterEach(() => {
    cleanupDocument()
    vi.restoreAllMocks()
  })

  it('throws if not passed a valid form element', () => {
    expect(() => watchForm(null)).toThrow('[SF] watchForm() requires a valid <form> element.')
    expect(() => watchForm({})).toThrow('[SF] watchForm() requires a valid <form> element.')
  })

  it('runs `reconnect` right away on init', () => {
    const spies = createWatchSpies()
    watchForm(form)
    expectHandlersCalledWithForm(spies, form)
  })

  it('allows updating options via `setOptions` and `reconnect`', async () => {
    const spies = createWatchSpies()
    const suriform = watchForm(form)

    vi.spyOn(validateModule, 'validateField').mockResolvedValue(true)
    await suriform.setOptions({ validateOnBlur: true })

    expectUnhandlersCalledWithForm(spies, form)
    expectHandlersCalledWithForm(spies, form)
  })

  it('does not `reconnect` if options are unchanged with `setOptions`', async () => {
    const suriform = watchForm(form)
    const spyReconnect = vi.spyOn(suriform, 'reconnect')
    const spyDisconnect = vi.spyOn(suriform, 'disconnect')

    await suriform.setOptions({})
    expect(spyReconnect).not.toHaveBeenCalled()
    expect(spyDisconnect).not.toHaveBeenCalled()
  })

  it('cleans up watchers and listeners with `disconnect`', () => {
    const spies = createWatchSpies()
    const suriform = watchForm(form)

    suriform.disconnect()
    expectUnhandlersCalledWithForm(spies, form)
  })

  it('attaches watchers and listeners with `reconnect`', () => {
    const spies = createWatchSpies()
    const suriform = watchForm(form)

    suriform.disconnect()
    suriform.reconnect()
    expectHandlersCalledWithForm(spies, form)
  })
})

describe('Global API exports', () => {
  it('exports defineRule, defineRules, localize, setLocale, validateForm, and resetForm', () => {
    expect(typeof defineRule).toBe('function')
    expect(typeof defineRules).toBe('function')
    expect(typeof localize).toBe('function')
    expect(typeof setLocale).toBe('function')
    expect(typeof validateForm).toBe('function')
    expect(typeof resetForm).toBe('function')
  })
})
