---
title: useAjax()
---

# `useAjax(form)`

The `useAjax()` function initializes an **AJAX event controller** for a form. It provides a clean, event-driven interface for handling **submission success** and **failure events**.

## 📥 Import

```js
import { useAjax } from 'suriform/tools'
```

## ▶️ Usage

```js
const form = document.querySelector('form')
const ajax = useAjax(form)

ajax.onSuccess((response) => {
  console.log('Form submitted successfully:', response)
})

ajax.onError((error) => {
  console.error('Form submission failed:', error)
})
```

> 💡 Each form initializes only **one** `useAjax()` controller, even if called multiple times.

## 🧾 API

### `useAjax(form)`

| Parameter | Type              | Required | Description                       |
| --------- | ----------------- | -------- | --------------------------------- |
| `form`    | `HTMLFormElement` | Yes      | The form element to attach hooks. |

> ⚠️ Throws an `Error` if the argument is not a valid `<form>` element.

## ↩️ Returns

An object exposing reactive event hooks:

| Method                | Description                                 |
| --------------------- | ------------------------------------------- |
| `onSuccess(callback)` | Triggered when an AJAX submission succeeds. |
| `onError(callback)`   | Triggered when an AJAX submission fails.    |
