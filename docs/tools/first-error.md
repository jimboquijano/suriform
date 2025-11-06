---
title: firstError()
---

# `firstError(form, options?)`

The `firstError()` function **guides the user to the first invalid field** after form validation, allowing you to **focus** or **scroll** to the first error for accessibility and better UX.

## 📥 Import

```js
import { firstError } from 'suriform/tools'
```

## ▶️ Usage

```js
const form = document.querySelector('#signup')
const guide = firstError(form, { focus: true, scroll: true })

guide.onCapture(({ field, message }) => {
  console.log('First error detected:', field.name, message)
})
```

> 💡 Works seamlessly with handleErrors() to combine error tracking with user guidance.

## ⚙️ Options

| Option   | Type                | Default | Description                                                                                                            |
| -------- | ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `focus`  | `boolean`           | `false` | Focus the first invalid field when triggered.                                                                          |
| `scroll` | `boolean \| object` | `false` | Scroll the first invalid field into view. Can be `true` or a custom object: `{ behavior: 'smooth', block: 'center' }`. |

## 🧾 API

### `firstError(form, options?)`

| Parameter | Type              | Required | Description                               |
| --------- | ----------------- | -------- | ----------------------------------------- |
| `form`    | `HTMLFormElement` | Yes      | Target form element to observe.           |
| `options` | `object`          | No       | Configuration for focus/scroll behaviors. |

> ⚠️ Throws an `Error` if the argument is not a valid `<form>` element.

## ↩️ Returns

An object exposing reactive event hooks:

| Method                | Description                                         |
| --------------------- | --------------------------------------------------- |
| `onCapture(callback)` | Triggered when the first invalid field is detected. |
