---
title: Native Rules
---

# Native Rules

## 📥 Import

```js
import { nativeRules } from 'suriform/rules'
```

## 📌 Overview

| Rule        | Description                                     | Type   |
| ----------- | ----------------------------------------------- | ------ |
| `required`  | Must not be empty                               | text   |
| `email`     | Must be a valid email address                   | text   |
| `url`       | Must be a valid URL                             | text   |
| `min`       | Must be ≥ a minimum numeric value               | number |
| `max`       | Must be ≤ a maximum numeric value               | number |
| `step`      | Must match step intervals (numeric)             | number |
| `minlength` | Must be at least a minimum number of characters | text   |
| `maxlength` | Must be at most a maximum number of characters  | text   |
| `pattern`   | Must match a regular expression                 | text   |

> ⚠️ Suriform includes `required` by default, so you don’t need to define it manually.

## 📝 Examples

```html
<input type="email" />
<input type="url" />
<input type="number" min="5" max="10" step="2" />
<input type="text" minlength="3" maxlength="10" />
<input type="text" pattern="^[A-Z]{3}$" />
<input required />
```

## ▶️ Usage

```html
<form id="signup">
  <label>
    Email:
    <input type="email" name="email" />
  </label>

  <label>
    Age:
    <input type="number" name="age" min="18" max="99" step="1" />
  </label>

  <label>
    Code:
    <input type="text" name="code" pattern="^[A-Z]{3}$" minlength="3" maxlength="3" />
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { nativeRules } from 'suriform/rules'

const form = document.querySelector('#signup')
watchform(form)
defineRules(nativeRules)
```
