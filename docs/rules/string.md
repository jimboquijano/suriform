---
title: String Rules
---

# String Rules

## 📥 Import

```js
import { stringRules } from 'suriform/rules'
```

## 📌 Overview

| Rule          | Description                            | Type |
| ------------- | -------------------------------------- | ---- |
| `length`      | Must be exactly N characters           | text |
| `regex`       | Must match a regex pattern with flags  | text |
| `contains`    | Must contain a specific substring      | text |
| `notContains` | Must not contain a specific substring  | text |
| `oneOf`       | Must match one of the allowed values   | text |
| `notOneOf`    | Must not match forbidden values        | text |
| `betweenChar` | Must be between min and max characters | text |
| `strong`      | Must be a strong password              | text |

## 📝 Examples

```html
<input type="text" length="5" />
<input type="text" regex="^[A-Za-z]+$,i" />
<input type="text" contains="abc" />
<input type="text" not-contains="xyz" />
<input type="text" one-of="yes,no,maybe" />
<input type="text" not-one-of="admin,root,test" />
<input type="text" between-char="3,10" />
<input type="password" strong />
```

## ▶️ Usage

```html
<form id="signup">
  <label>
    Username:
    <input type="text" name="username" length="5" />
  </label>

  <label>
    Password:
    <input type="password" name="password" strong />
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { stringRules } from 'suriform/rules'

const form = document.querySelector('#signup')
watchform(form)
defineRules(stringRules)
```
