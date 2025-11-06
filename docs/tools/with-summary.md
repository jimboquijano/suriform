---
title: withSummary()
---

# `withSummary(form, options?)`

The `withSummary()` function provides a **stateful validation summary** for a form. It collects active errors into a **centralized list**, allowing users to **see all errors at a glance**.

## 📥 Import

```js
import { withSummary } from 'suriform/tools'
```

## ▶️ Usage

```js
const form = document.querySelector('#signup')
const summary = withSummary(form)

summary.addError(form.username, 'Username is required!')
summary.removeError(form.username)

summary.addErrors([
  { field: form.email, message: 'Invalid email address' },
  { field: form.password, message: 'Password is too short' }
])
```

## ⚙️ Options

| Option             | Type          | Default | Description                                                          |
| ------------------ | ------------- | ------- | -------------------------------------------------------------------- |
| `highlightOnHover` | `boolean`     | `true`  | Temporarily highlights the related form field on summary item hover. |
| `scrollOnClick`    | `boolean`     | `true`  | Scrolls smoothly to the field and focuses it when clicking an error. |
| `includePrefix`    | `boolean`     | `true`  | Prefix each error message with the field name or ID.                 |
| `container`        | `HTMLElement` | `form`  | The container where the summary list will be rendered.               |

## 🧾 API

### `withSummary(form, options?)`

| Parameter | Type              | Required | Description                                                |
| --------- | ----------------- | -------- | ---------------------------------------------------------- |
| `form`    | `HTMLFormElement` | Yes      | The form element to enhance with a validation summary.     |
| `options` | `object`          | No       | Optional configuration for summary behavior and rendering. |

> ⚠️ Throws an `Error` if the argument is not a valid `<form>` element.

## ↩️ Returns

An object exposing summary control methods:

| Method                        | Description                                                            |
| ----------------------------- | ---------------------------------------------------------------------- |
| `addError(field, message)`    | Add or update a field error in the summary.                            |
| `removeError(field)`          | Remove a specific field’s error from the summary.                      |
| `addErrors(errorsArray)`      | Display multiple errors at once from an array of `{ field, message }`. |
| `removeErrors([exceptField])` | Remove all errors except for the specified field.                      |
