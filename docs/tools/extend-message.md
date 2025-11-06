---
title: extendMessage()
---

# `extendMessage(form)`

The `extendMessage()` utility provides **message transformation layers** for a form. It allows **grouping and wrapping messages** without modifying core validation logic.

## 📥 Import

```js
import { extendMessage } from 'suriform/tools'
```

## ▶️ Usage

```js
const form = document.querySelector('#signup')
const ext = extendMessage(form)

ext.groupMessage({
  rules: ['minlength', 'maxlength'],
  message: 'Length must be between 5 and 20 characters'
})

message.wrapMessage(({ field, message }) => {
  return `<div class="my-error">[${field.name}] ${message}</div>`
})
```

## 🧾 API

### `extendMessage(form)`

| Parameter | Type              | Required | Description                                         |
| --------- | ----------------- | -------- | --------------------------------------------------- |
| `form`    | `HTMLFormElement` | Yes      | The form element to attach message transformations. |

> ⚠️ Throws an `Error` if the argument is not a valid `<form>` element.

## ↩️ Returns

An object with control methods:

| Method                  | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `groupMessage(config)`  | Aggregate multiple rule messages into a single unified message.                               |
| `wrapMessage(callback)` | Apply a final transformation to messages before rendering (e.g., localization or formatting). |
