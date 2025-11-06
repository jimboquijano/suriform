---
title: Alpha Rules
---

# Alpha Rules

## 📥 Import

```js
import { alphaRules } from 'suriform/rules'
```

## 📌 Overview

| Rule             | Description                               | Type |
| ---------------- | ----------------------------------------- | ---- |
| `alpha`          | Must contain only letters                 | text |
| `alphaDash`      | Must contain letters, dash, or underscore | text |
| `alphaNum`       | Must contain letters and numbers          | text |
| `alphaSpaces`    | Must contain letters and spaces           | text |
| `alphaNumSpaces` | Must contain letters, numbers, and spaces | text |

## 📝 Examples

```html
<input type="text" alpha />
<input type="text" alpha-dash />
<input type="text" alpha-num />
<input type="text" alpha-spaces />
<input type="text" alpha-num-spaces />
```

## ▶️ Usage

```html
<form id="signup">
  <label>
    Name:
    <input name="fullName" alpha-spaces />
  </label>

  <label>
    Username:
    <input name="username" alphaDash />
  </label>

  <label>
    Password:
    <input name="password" alphaNum />
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { alphaRules } from 'suriform/rules'

const form = document.querySelector('#signup')
watchform(form)
defineRules(alphaRules)
```
