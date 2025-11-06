---
title: watchForm()
---

# `watchForm(form, options?)`

The `watchForm()` function connects a form to the validation engine, handling form and field events. It’s lightweight and doesn’t maintain heavy instances. Each call to `watchForm()` returns a **small controller** to update options or disconnect validation at any time.

## 📥 Import

```js
import { watchForm } from 'suriform'
```

## ▶️ Usage

```js
const form = document.querySelector('form')

const sf = watchForm(form, {
  validateOnSubmit: true,
  validateOnBlur: true,
  debounce: 300
})
```

## ⚙️ Options

| Option             | Default | Description                                                |
| ------------------ | ------- | ---------------------------------------------------------- |
| `debounce`         | `0`     | Delay (in milliseconds) before validating after user input |
| `validateOnSubmit` | `true`  | Validate when the form is submitted                        |
| `validateOnBlur`   | `false` | Validate when a field loses focus                          |
| `validateOnInput`  | `false` | Validate on every keystroke or change                      |
| `stopOnFirstError` | `true`  | Stop validating after the first rule fails                 |

## 🧾 API

### `watchForm(form, options?)`

| Parameter | Type              | Default | Description                                  |
| --------- | ----------------- | ------- | -------------------------------------------- |
| `form`    | `HTMLFormElement` | —       | The target `<form>` element to observe.      |
| `options` | `Object`          | `{}`    | Optional configuration to override defaults. |

> ⚠️ Throws a `TypeError` if the provided form is not a valid `<form>` element.

## ↩️ Returns

An **object controller** with the following methods:

| Method                       | Description                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **`setOptions(newOptions)`** | Dynamically updates configuration and rebinds listeners if necessary. Useful for enabling or disabling validation triggers at runtime. |
| **`reconnect()`**            | Reattaches event listeners and validation watchers if disconnected. Does nothing if already active.                                    |
| **`disconnect()`**           | Safely removes all listeners and observers from the form. Ideal for cleanup before unmounting a view or switching pages.               |

> 💡 When `setOptions()` is called, it automatically disconnects and reconnects the watchers — ensuring new settings are applied and watchers are triggered accordingly.

## ➡️ Internal Flow

`reconnect()` internally coordinates multiple utilities:

1. `handleSubmit()` → attaches a `submit` listener for a full-form validation.
2. `handleReset()` → attaches a `reset` listener for a clean slate reset.
3. `handleInput()` / `handleBlur()` → observes field-level interactions (`input`, `blur`).

`disconnect()` internally coordinates multiple utilities:

1. `unhandleSubmit()` / `unhandleReset()` → safely clean up form-level listeners.
2. `unhandleInput()` / `unhandleBlur()` → safely clean up field-level listeners.
