/**
 * @file helpers/format/formatFileSize.test.js
 */
import { describe, it, expect } from 'vitest'
import { formatFileSize } from '../../../src/helpers/format'

describe('formatFileSize()', () => {
  it('formats values under 1 KB as bytes', () => {
    expect(formatFileSize(512)).toBe('512 bytes')
  })

  it('formats values in kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
  })

  it('formats values in megabytes correctly', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
  })

  it('formats values in gigabytes correctly', () => {
    expect(formatFileSize(1024 ** 3)).toBe('1 GB')
  })

  it('rounds converted values to one decimal place', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })
})
