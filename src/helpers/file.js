/**
 * @file helpers/file.js
 * @description File-related utility helpers for Suriform.
 *
 * Provides reusable functions for normalizing file inputs,
 * validating single or multiple files, and creating asynchronous
 * image dimension validators.
 */

import { loadImage } from './dom'

/**
 * Normalize a single file or multiple files into an array.
 *
 * 1. Accepts a File, FileList, or an array of File objects.
 * 2. Converts the input into a uniform array of File objects.
 * 3. Ensures consistent handling of single or multiple file inputs across validators.
 *
 * @param {File|FileList|Array<File>} file - File(s) to normalize.
 * @returns {Array<File>} Array of File objects.
 *
 * @example
 * normalizeFiles(input.files) // → [File, File, ...]
 */
export const normalizeFiles = (file) =>
  Array.isArray(file) || file instanceof FileList ? Array.from(file) : [file]

/**
 * Factory to create synchronous file validators for single or multiple files.
 *
 * 1. Accepts a validation callback that runs on each file individually.
 * 2. Automatically normalizes single or multiple file inputs using `normalizeFiles()`.
 * 3. Executes the validation callback for every file and returns true only if all pass.
 * 4. Skips validation if the field type is not `file` or arguments are invalid.
 *
 * @param {Function} fn - Validation function (file: File, args: any) => boolean.
 * @returns {Function} Validator function compatible with Suriformform rules.
 *
 * @example
 * const maxSizeValidator = multiFileValidator((file, [max]) => file.size <= max)
 */
export const multiFileValidator =
  (fn) =>
  (file, args, { type }) => {
    if (type !== 'file') return true
    if (!file || !args) return true

    const files = normalizeFiles(file)
    return files.every((f) => fn(f, args))
  }

/**
 * Factory to create asynchronous image dimension validators for single or multiple files.
 *
 * 1. Accepts a callback that receives each image’s width, height, and a numeric limit.
 * 2. Converts the file input into an array of files using `normalizeFiles()`.
 * 3. Loads each image asynchronously with `loadImage()`.
 * 4. Validates each image using the provided callback and resolves true only if all pass.
 * 5. Safely ignores invalid limits or non-file field types.
 *
 * @param {Function} fn - Validation function (width: number, height: number, limit: number) => boolean.
 * @returns {Function} Asynchronous validator function for Suriformform rules.
 *
 * @example
 * const minWidthValidator = multiFileImageValidator((width, _, min) => width >= min)
 */
export const multiFileImageValidator =
  (fn) =>
  (file, [limit], { type }) => {
    if (type !== 'file') return true
    if (!file || !limit) return true

    const numericLimit = parseInt(limit, 10)
    if (isNaN(numericLimit)) return true

    const files = normalizeFiles(file)
    return Promise.all(
      files.map(
        (f) =>
          new Promise((resolve) => {
            loadImage(
              f,
              (width, height) => resolve(fn(width, height, numericLimit)),
              () => resolve(true)
            )
          })
      )
    ).then((results) => results.every(Boolean))
  }
