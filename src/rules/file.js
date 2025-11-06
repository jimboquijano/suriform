/**
 * @file rules/file.js
 * @description File validation rules for Suriform forms.
 */

import { formatList, formatFileSize } from '../helpers/format'
import { multiFileValidator, multiFileImageValidator } from '../helpers/file'

/**
 * Validate that selected file has an allowed extension.
 * Example: <input type="file" ext=".jpg,.png" />
 */
export const ext = {
  validate: multiFileValidator((f, extList) => {
    const allowedExts = extList
      .map((e) => e.trim().toLowerCase())
      .map((e) => (e.startsWith('.') ? e : `.${e}`))
    const fileExt = '.' + (f.name || '').split('.').pop().toLowerCase()
    return allowedExts.includes(fileExt)
  }),
  format: (_, extList) => {
    return { allowed: formatList(extList) }
  },
  message: 'File extension must be one of: {allowed}.'
}

/**
 * Validate that selected file matches allowed MIME types.
 * Example: <input type="file" mimes="image/jpeg,image/png" />
 */
export const mimes = {
  validate: multiFileValidator((f, mimes) => {
    return mimes.includes(f.type)
  }),
  format: (_, mimes) => {
    return { allowed: formatList(mimes) }
  },
  message: 'File type must be one of: {allowed}.'
}

/**
 * Validate that selected file does not exceed max size.
 * Example: <input type="file" max-size="1048576" />
 */
export const maxSize = {
  validate: multiFileValidator((f, [maxSize]) => {
    const max = parseInt(maxSize, 10)
    if (isNaN(max)) return true
    return f.size <= max
  }),
  format: (_, [maxSize]) => {
    return { size: formatFileSize(maxSize) }
  },
  message: 'File size must not exceed {size}.'
}

/**
 * Validate that image width is at least the minimum.
 */
export const minWidth = {
  validate: multiFileImageValidator((width, _, min) => width >= min),
  message: 'Image width must be at least {width}px.'
}

/**
 * Validate that image height is at least the minimum.
 */
export const minHeight = {
  validate: multiFileImageValidator((_, height, min) => height >= min),
  message: 'Image height must be at least {height}px.'
}

/**
 * Validate that image width does not exceed the maximum.
 */
export const maxWidth = {
  validate: multiFileImageValidator((width, _, max) => width <= max),
  message: 'Image width must not exceed {width}px.'
}

/**
 * Validate that image height does not exceed the maximum.
 */
export const maxHeight = {
  validate: multiFileImageValidator((_, height, max) => height <= max),
  message: 'Image height must not exceed {height}px.'
}

/**
 * Grouped file rules for easy import
 */
export const fileRules = {
  ext,
  mimes,
  maxSize,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight
}
