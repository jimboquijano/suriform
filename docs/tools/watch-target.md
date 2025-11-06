---
title: watchTarget()
---

# `watchTarget(form, registry)`

The `watchTarget()` function provides **target-based validation** for forms. It monitors **target fields** and triggers validation on dependent fields when the target fields change.

## 📥 Import

```js
import { watchTarget } from 'suriform/tools'
```

## ▶️ Usage

```js
const form = document.querySelector('#signup')

const watcher = watchTarget(form, [
  { confirmPassword: 'password' },
  { state: ['country', 'region'] }
])
```

### 💡 Notes

- Each registry item maps a **dependent field** to one or more **target field names**.
- Changes in target fields automatically re-validate the dependent field.
- Multiple targets can trigger the same dependent field validation.

## 🧾 API

### `watchTarget(form, registry)`

| Parameter  | Type              | Required | Description                                                 |
| ---------- | ----------------- | -------- | ----------------------------------------------------------- |
| `form`     | `HTMLFormElement` | Yes      | The form element to monitor.                                |
| `registry` | `Array`           | Yes      | List of objects mapping dependent fields → target field(s). |

> ⚠️ Throws an `Error` if the argument is not a valid `<form>` element.

## ↩️ Returns

An object with control methods:

| Method         | Description                                           |
| -------------- | ----------------------------------------------------- |
| `reconnect()`  | Starts or resumes monitoring all target dependencies. |
| `disconnect()` | Stops monitoring and removes all event listeners.     |

> 💡 Use `disconnect()` to clean up listeners when the form is removed.
