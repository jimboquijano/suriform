/**
 * @file helpers/dom/loadImage.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadImage } from '../../../src/helpers/dom'

describe('loadImage()', () => {
  let originalCreateObjectURL, originalRevokeObjectURL

  beforeEach(() => {
    originalCreateObjectURL = URL.createObjectURL
    originalRevokeObjectURL = URL.revokeObjectURL
    URL.createObjectURL = vi.fn(() => 'mock-url')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  it('skips non-image files', () => {
    const file = new File(['data'], 'test.txt', { type: 'text/plain' })
    const cb = vi.fn()
    loadImage(file, cb)
    expect(cb).not.toHaveBeenCalled()
  })

  it('invokes callback with image dimensions once loaded', () => {
    const file = new File(['img'], 'test.png', { type: 'image/png' })
    const cb = vi.fn()
    const img = {}
    global.Image = vi.fn(() => img)

    loadImage(file, cb)
    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    expect(img.src).toBe('mock-url')

    img.width = 123
    img.height = 456
    img.onload()
    expect(cb).toHaveBeenCalledWith(123, 456)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url')
  })

  it('triggers `onError` callback when image fails to load', () => {
    const file = new File(['img'], 'test.png', { type: 'image/png' })
    const cb = vi.fn()
    const onError = vi.fn()
    const img = {}
    global.Image = vi.fn(() => img)

    loadImage(file, cb, onError)
    img.onerror()
    expect(onError).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url')
  })
})
