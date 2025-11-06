---
title: handleErrors()
---

# `handleErrors(form, options?)`

The `handleErrors()` function provides **reactive tracking** for validation errors. It observes the form’s **validity lifecycle** and listens to form and field **validation events**.

## 📥 Import

```js
import { handleErrors } from 'suriform/tools'
```

## ▶️ Usage

```js
const form = document.querySelector('#login')
const errors = handleErrors(form)

errors.onAdd(({ field, message }) => {
  console.log(`Error on ${field.name}: ${message}`)
})

errors.onEmpty(() => {
  console.log('All errors cleared!')
})
```

Use with [`withPopup()`](../tools/with-popup) and [`withSummary()`](../tools/with-summary) seamlessly.

```js
const errors = handleErrors(form, {
  withPopup: { position: 'right' },
  withSummary: { target: '#summary' }
})
```

> 💡 Under the hood, `handleErrors()` listens to validation events from `useValidity()`.

## ⚙️ Options

| Option        | Type                | Default | Description                                                   |
| ------------- | ------------------- | ------- | ------------------------------------------------------------- |
| `withPopup`   | `boolean \| object` | `false` | Enables popup-based inline error display via `withPopup()`.   |
| `withSummary` | `boolean \| object` | `false` | Enables summary-based error list display via `withSummary()`. |

## 🧾 API

### `handleErrors(form, options?)`

| Parameter | Type              | Required | Description                                   |
| --------- | ----------------- | -------- | --------------------------------------------- |
| `form`    | `HTMLFormElement` | Yes      | The target form element to observe.           |
| `options` | `object`          | No       | Configuration for popup/summary integrations. |

> ⚠️ Throws an `Error` if the argument is not a valid `<form>` element.

## ↩️ Returns

An object exposing reactive event hooks and query helpers:

| Method                | Description                                       |
| --------------------- | ------------------------------------------------- |
| `onAdd(callback)`     | Triggered when a new error is added.              |
| `onChange(callback)`  | Triggered when an existing error message updates. |
| `onRemove(callback)`  | Triggered when an error is removed.               |
| `onCollect(callback)` | Triggered after form-level validation completes.  |
| `onEmpty(callback)`   | Triggered when all errors are cleared or reset.   |
| `getErrors()`         | Returns a list of `{ field, message }` pairs.     |
| `getError(field)`     | Returns the message for a specific field.         |

> 💡

Learn more about
