---
title: withPopup()
---

# `withPopup(form, options?)`

The `withPopup()` function provides **floating, accessible error popups** for a form. Popups update dynamically on **scroll**, **resize**, and during form and field **validation events**.

## 📥 Import

```js
import { withPopup } from 'suriform/tools'
```

## ▶️ Usage

```js
const form = document.querySelector('#signup')
const popup = withPopup(form, {
  displaySingle: false
})

popup.addError(form.username, 'Username is required!')
popup.removeError(form.username)

popup.addErrors([
  { field: form.email, message: 'Invalid email address' },
  { field: form.password, message: 'Password is too short' }
])
```

## ⚙️ Options

| Option          | Type      | Default | Description                                                                                          |
| --------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `displaySingle` | `boolean` | `true`  | If `true`, only the first invalid field displays a popup. Otherwise, all invalid fields show popups. |

## 🧾 API

### `withPopup(form, options?)`

| Parameter | Type              | Required | Description                  |
| --------- | ----------------- | -------- | ---------------------------- |
| `form`    | `HTMLFormElement` | Yes      | The target form element.     |
| `options` | `object`          | No       | Popup configuration options. |

> ⚠️ Throws an `Error` if the argument is not a valid `<form>` element.

## ↩️ Returns

An object exposing popup control methods:

| Method                        | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| `addError(field, message)`    | Show a popup message for a specific field.                  |
| `removeError(field)`          | Hide the popup for a specific field.                        |
| `addErrors(errorsArray)`      | Show multiple popups from an array of `{ field, message }`. |
| `removeErrors([exceptField])` | Hide all popups, optionally leaving one visible.            |
