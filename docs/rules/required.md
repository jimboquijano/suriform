---
title: Required Rules
---

# Required Rules

## 📥 Import

```js
import { requiredRules } from 'suriform/rules'
```

## 📌 Overview

| Rule              | Description                                         | Type |
| ----------------- | --------------------------------------------------- | ---- |
| `requiredIf`      | Must be filled if another field matches a value     | text |
| `requiredUnless`  | Must be filled unless another field matches a value | text |
| `requiredWith`    | Must be filled if another field has a value         | text |
| `requiredWithAll` | Must be filled if all referenced fields have values | text |

## 📝 Examples

```html
<input type="text" required-if="checkbox:true" />
<input type="text" required-unless="checkbox:true" />
<input type="text" required-with="email" />
<input type="text" required-with-all="firstName,lastName" />
```

## ▶️ Usage

```html
<form id="signup">
  <label>
    Email:
    <input name="email" required-with="username" />
  </label>

  <label>
    Phone:
    <input name="phone" required-if="contactMethod:phone" />
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { requiredRules } from 'suriform/rules'

const form = document.querySelector('#signup')
watchform(form)
defineRules(requiredRules)
```
