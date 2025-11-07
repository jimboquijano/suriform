---
title: validateForm()
---

# `validateForm(form, stopOnFirstError?)`

The `validateForm()` function runs a **full validation pass** across all fields in a form. It checks required fields, applies all defined validation rules, and collects error messages.

## 📥 Import

```js
import { validateForm } from 'suriform'
```

## ▶️ Usage

```js
const form = document.querySelector('form')
const result = await validateForm(form)

if (result.isValid) {
  console.log('Form is valid!')
} else {
  console.log('Errors:', result.errors)
}
```

## 🧾 API

### `validateForm(form, stopOnFirstError?)`

| Parameter          | Type              | Default | Description                                                       |
| ------------------ | ----------------- | ------- | ----------------------------------------------------------------- |
| `form`             | `HTMLFormElement` | —       | The form element to validate.                                     |
| `stopOnFirstError` | `boolean`         | `true`  | Whether to stop validation when the first invalid field is found. |

> ⚠️ Throws a `TypeError` if the argument is not a valid `<form>` element.

## ↩️ Returns

A `Promise` resolving to an object with the following shape:

| Property    | Type          | Description                                       |
| ----------- | ------------- | ------------------------------------------------- |
| `isValid`   | `boolean`     | Indicates the overall form validity.              |
| `errors`    | `Array`       | List of field errors. Each item contains:         |
| → `field`   | `HTMLElement` | The form field element associated with the error. |
| → `message` | `string`      | The validation error message for the field.       |

## ➡️ Internal Flow

`validateForm()` internally coordinates multiple utilities:

1. `retrieveFields()` — Collects all active fields from the form at runtime.
2. `validateField()` — Validates each field and toggles its error display.
3. `stopOnFirstError` — Stops the validation after the first invalid field.
4. `triggerHooks()` — Emits reactive form-level hooks (`onFail`, `onPass`).

`validateField()` internally coordinates multiple utilities:

1. `checkFieldValidity()` — Runs all defined rules for a single field.
2. `isFieldRequired()` — Evaluates both static and conditional “required” states.
3. `triggerHooks()` — Emits reactive field-level hooks (`onValid`, `onInvalid`).
4. `showError()` / `hideError()` — Toggles inline error display per field.

> This design ensures consistent behavior across form and field validations.
