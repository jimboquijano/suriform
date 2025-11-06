---
title: Number Rules
---

# Number Rules

## 📥 Import

```js
import { numberRules } from 'suriform/rules'
```

## 📌 Overview

| Rule      | Description                         | Type   |
| --------- | ----------------------------------- | ------ |
| `integer` | Must be an integer                  | number |
| `numeric` | Must be a number                    | number |
| `digits`  | Must have an exact number of digits | number |
| `between` | Must be between a min and max value | number |

## 📝 Examples

```html
<input type="text" integer />
<input type="text" numeric />
<input type="text" digits="5" />
<input type="text" between="3,10" />
```

## ▶️ Usage

```html
<form id="payment">
  <label>
    Age:
    <input name="age" integer />
  </label>

  <label>
    PIN:
    <input name="pin" digits="4" />
  </label>

  <label>
    Quantity:
    <input name="qty" between="1,100" />
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { numberRules } from 'suriform/rules'

const form = document.querySelector('#payment')
watchform(form)
defineRules(numberRules)
```
