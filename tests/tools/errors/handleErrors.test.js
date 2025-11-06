/**
 * @file tools/errors/handleErrors.test.js
 */

import { createFormField, cleanupDocument } from '../../utils/main'
import { handleErrors } from '../../../src/tools/errors'
import { withSummary } from '../../../src/tools/summary'
import { withPopup } from '../../../src/tools/popup'

/**
 * Create a standardized error mock object.
 */
const createErrorMock = () => ({
  addError: vi.fn(),
  removeError: vi.fn()
})

/**
 * Mock factory for all integrations.
 */
const setupMocks = () => {
  const summaryMock = createErrorMock()
  const popupMock = createErrorMock()
  const validityMock = {
    onInvalid: vi.fn(),
    onValid: vi.fn(),
    onFail: vi.fn(),
    onPass: vi.fn(),
    onReset: vi.fn()
  }

  vi.mock('../../../src/tools/summary', () => ({
    withSummary: vi.fn(() => summaryMock)
  }))

  vi.mock('../../../src/tools/popup', () => ({
    withPopup: vi.fn(() => popupMock)
  }))

  vi.mock('../../../src/tools/hooks', () => ({
    useValidity: vi.fn(() => validityMock)
  }))

  return { summaryMock, popupMock, validityMock }
}

const { summaryMock, popupMock, validityMock } = setupMocks()

/**
 * Utility to extract the first handler registered for a given hook type.
 */
const getHandler = (type) => validityMock[type].mock.calls[0][0]

describe('handleErrors()', () => {
  let form, field, withMessage, otherMessage, noMessage
  const addSpy = vi.fn()
  const changeSpy = vi.fn()
  const removeSpy = vi.fn()
  const collectSpy = vi.fn()
  const emptySpy = vi.fn()

  beforeEach(() => {
    ;({ form, field } = createFormField('<input type="text" />'))

    withMessage = { field, message: 'Required' }
    otherMessage = { field, message: 'Obligatoire' }
    noMessage = { field, message: '' }
  })

  afterEach(() => {
    cleanupDocument()
    vi.clearAllMocks()
  })

  it('throws if form is invalid', () => {
    expect(() => handleErrors(null)).toThrow('[SF] handleErrors() requires a valid form element.')
  })

  it('returns reactive API with expected methods', () => {
    const errors = handleErrors(form)
    expect(errors).toMatchObject({
      onAdd: expect.any(Function),
      onRemove: expect.any(Function),
      getError: expect.any(Function),
      getErrors: expect.any(Function)
    })
  })

  it('calls `onAdd` when an error is added', () => {
    const errors = handleErrors(form)
    const invalidHandler = getHandler('onInvalid')
    errors.onAdd(addSpy)

    invalidHandler(withMessage)
    expect(addSpy).toHaveBeenCalledWith(withMessage)
  })

  it('calls `onChange` when an error is updated', () => {
    const errors = handleErrors(form)
    const invalidHandler = getHandler('onInvalid')
    errors.onChange(changeSpy)

    invalidHandler(withMessage)
    invalidHandler(otherMessage)
    expect(changeSpy).toHaveBeenCalledWith(otherMessage)
  })

  it('calls `onRemove` when an error is removed', () => {
    const errors = handleErrors(form)
    const invalidHandler = getHandler('onInvalid')
    const validHandler = getHandler('onValid')

    errors.onAdd(addSpy)
    errors.onRemove(removeSpy)

    invalidHandler(withMessage)
    expect(addSpy).toHaveBeenCalledWith(withMessage)

    validHandler(noMessage)
    expect(removeSpy).toHaveBeenCalledWith(withMessage)
  })

  it('calls `onCollect` when errors are collected', () => {
    const errors = handleErrors(form)
    const invalidHandler = getHandler('onFail')
    errors.onCollect(collectSpy)

    invalidHandler([withMessage])
    expect(collectSpy).toHaveBeenCalledWith([withMessage])
  })

  it('calls `onEmpty` when errors are collected', () => {
    const errors = handleErrors(form)
    const validHandler = getHandler('onPass')
    errors.onEmpty(emptySpy)

    validHandler()
    expect(emptySpy).toHaveBeenCalledWith()
  })

  it('tracks and updates errors accordingly', () => {
    const errors = handleErrors(form)
    const invalidHandler = getHandler('onInvalid')
    const validHandler = getHandler('onValid')

    invalidHandler(withMessage)
    expect(errors.getError(field)).toBe('Required')
    expect(errors.getErrors()).toEqual([withMessage])

    validHandler(noMessage)
    expect(errors.getError(field)).toBeUndefined()
    expect(errors.getErrors()).toEqual([])
  })

  it('initializes `withPopup` integration when enabled', () => {
    handleErrors(form, { withPopup: true })
    expect(withPopup).toHaveBeenCalledWith(expect.any(HTMLFormElement), {})
  })

  it('initializes `withSummary` integration when enabled', () => {
    handleErrors(form, { withSummary: true })
    expect(withSummary).toHaveBeenCalledWith(expect.any(HTMLFormElement), {})
  })

  it('triggers `withPopup` and `withSummary` feedbacks accordingly', () => {
    handleErrors(form, { withSummary: true, withPopup: true })
    const invalidHandler = getHandler('onInvalid')
    const validHandler = getHandler('onValid')

    invalidHandler(withMessage)
    expect(summaryMock.addError).toHaveBeenCalledWith(field, 'Required')
    expect(popupMock.addError).toHaveBeenCalledWith(field, 'Required')

    validHandler(noMessage)
    expect(summaryMock.removeError).toHaveBeenCalledWith(field)
    expect(popupMock.removeError).toHaveBeenCalledWith(field)
  })
})
