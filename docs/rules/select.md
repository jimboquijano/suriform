---
title: Select Rules
---

# Select Rules

## 📥 Import

```js
import { selectRules } from 'suriform/rules'
```

## 📌 Overview

| Rule        | Description                        | Type   |
| ----------- | ---------------------------------- | ------ |
| `minSelect` | Must select at least N options     | select |
| `maxSelect` | Must select no more than N options | select |
| `allowed`   | Must select only allowed options   | select |
| `forbidden` | Must not select forbidden options  | select |

## 📝 Examples

```html
<select multiple min-select="2">
  <option value="red">Red</option>
  <option value="green">Green</option>
</select>

<select multiple max-select="3"></select>
<select multiple allowed="red,green,blue"></select>
<select multiple forbidden="yellow,pink"></select>
```

## ▶️ Usage

```html
<form id="colors">
  <label>
    Choose your colors:
    <select name="colors" multiple min-select="2" max-select="3" allowed="red,green,blue">
      <option value="red">Red</option>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
      <option value="yellow">Yellow</option>
    </select>
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { selectRules } from 'suriform/rules'

const form = document.querySelector('#colors')
watchform(form)
defineRules(selectRules)
```
