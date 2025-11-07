---
title: useValidity()
---

# `useValidity(form)`

The `useValidity()` function creates a **validation event controller** for a form. It lets you attach **custom callbacks** that respond to form and field **validation states**.

## 📥 Import

```js
import { useValidity } from 'suriform/tools'
```

## ▶️ Usage

```js
const form = document.querySelector('form')
const validity = useValidity(form)
```

> 💡 Each form initializes **one** `useValidity()` controller, even if called multiple times.

## 🧩 Hooks

🔹 Listen for field validation.

```js
validity.onInvalid(({ field, message }) => {
  console.log('Invalid field:', field.name, message)
})

validity.onValid(({ field }) => {
  console.log('Valid field:', field.name)
})
```

🔹 Listen for form validation.

```js
validity.onFail((errors) => {
  console.warn('Form failed:', errors)
})

validity.onPass(() => {
  console.log('Form passed.')
})
```

🔹 Listen for form reset.

```js
validity.onReset(() => {
  console.log('Form is reset.')
})
```

## 🧾 API

### `useValidity(form)`

| Parameter | Type              | Required | Description                       |
| --------- | ----------------- | -------- | --------------------------------- |
| `form`    | `HTMLFormElement` | Yes      | The form element to attach hooks. |

> ⚠️ Throws an `Error` if the argument is not a valid `<form>` element.

## ↩️ Returns

An object exposing reactive event hooks:

| Method                | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `onInvalid(callback)` | Triggered when a field fails validation.                   |
| `onValid(callback)`   | Triggered when a field becomes valid.                      |
| `onFail(callback)`    | Triggered when full-form validation fails.                 |
| `onPass(callback)`    | Triggered when full-form validation passes.                |
| `onReset(callback)`   | Triggered when the form resets to its initial clean state. |
