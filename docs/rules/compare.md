---
title: Comparison Rules
---

# Comparison Rules

## 📥 Import

```js
import { compareRules } from 'suriform/rules'
```

## 📌 Overview

| Rule           | Description                                       | Type   |
| -------------- | ------------------------------------------------- | ------ |
| `match`        | Must equal a fixed value                          | text   |
| `unmatch`      | Must **not** equal a fixed value                  | text   |
| `greater`      | Must be greater than a fixed number               | number |
| `less`         | Must be less than a fixed number                  | number |
| `confirm`      | Must match another field (e.g., password confirm) | text   |
| `matchWith`    | Must match another field’s value                  | text   |
| `unmatchWith`  | Must **not** match another field’s value          | text   |
| `greaterThan`  | Must be greater than another field’s value        | number |
| `lessThan`     | Must be less than another field’s value           | number |
| `greaterEqual` | Must be ≥ target field’s value                    | number |
| `lessEqual`    | Must be ≤ target field’s value                    | number |

## 📝 Examples

```html
<input name="age" match="5" />
<input name="age" unmatch="5" />
<input type="number" greater="5" />
<input type="number" less="5" />
<input name="passwordConfirm" confirm="password" />
<input name="field2" match-with="field1" />
<input name="field2" unmatch-with="field1" />
<input type="number" greater-than="field1" />
<input type="number" less-than="field1" />
<input type="number" greater-equal="field1" />
<input type="number" less-equal="field1" />
```

## ▶️ Usage

```html
<form id="payment">
  <label>
    Password:
    <input type="password" name="password" />
  </label>

  <label>
    Confirm Password:
    <input type="password" name="passwordConfirm" confirm="password" />
  </label>

  <label>
    Age:
    <input type="number" name="age" greater="18" />
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { compareRules } from 'suriform/rules'

const form = document.querySelector('#signup')
watchform(form)
defineRules(compareRules)
```
