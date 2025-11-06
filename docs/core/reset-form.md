---
title: resetForm()
---

# `resetForm(form)`

The `resetForm()` function restores your form’s **validation state** to a clean slate. It removes all **validation errors**, ensuring the form looks as if it were never interacted with.

## 📥 Import

```js
import { resetForm } from 'suriform'
```

## ▶️ Usage

```js
const form = document.querySelector('form')
resetForm(form)
```

## 🧾 API

### `resetForm(form)`

| Parameter | Type              | Description                                |
| --------- | ----------------- | ------------------------------------------ |
| `form`    | `HTMLFormElement` | The form element whose validation to reset |

> ⚠️ Throws a `TypeError` if the argument is not a valid `<form>` element.

## ➡️ Internal Flow

`resetForm()` internally coordinates multiple utilities:

1. `retrieveFields()` — Collects all active fields from the form at runtime.
2. `hideError()` — Removes the inline error per form field.
3. `triggerHooks()` — Emits reactive form-level hooks (`onReset`).

> This design ensures consistent resets, even for dynamic or async fields.
