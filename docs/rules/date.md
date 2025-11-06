---
title: Date Rules
---

# Date Rules

## 📥 Import

```js
import { dateRules } from 'suriform/rules'
```

## 📌 Overview

| Rule          | Description                         | Type |
| ------------- | ----------------------------------- | ---- |
| `dateBefore`  | Must be before a reference date     | date |
| `dateAfter`   | Must be after a reference date      | date |
| `dateBetween` | Must be between two dates           | date |
| `minDate`     | Must be on or after a minimum date  | date |
| `maxDate`     | Must be on or before a maximum date | date |

## 📝 Examples

```html
<input type="date" date-before="startDate" />
<input type="date" date-after="startDate" />
<input type="date" date-between="2021-01-01,2021-12-31" />
<input type="date" min-date="2020-01-01" />
<input type="date" max-date="2022-12-31" />
```

## ▶️ Usage

```html
<form id="booking">
  <label>
    Start Date:
    <input type="date" name="startDate" />
  </label>

  <label>
    End Date:
    <input type="date" name="endDate" date-after="startDate" />
  </label>

  <label>
    Event Date:
    <input type="date" name="event" date-between="2021-01-01,2021-12-31" />
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { dateRules } from 'suriform/rules'

const form = document.querySelector('#booking')
watchform(form)
defineRules(dateRules)
```
