---
title: File Rules
---

# File Rules

## 📥 Import

```js
import { fileRules } from 'suriform/rules'
```

## 📌 Overview

| Rule        | Description                           | Type  |
| ----------- | ------------------------------------- | ----- |
| `ext`       | Must have an allowed file extension   | file  |
| `mimes`     | Must match allowed MIME types         | file  |
| `maxSize`   | Must not exceed a maximum file size   | file  |
| `minWidth`  | Image width must be at least minimum  | image |
| `minHeight` | Image height must be at least minimum | image |
| `maxWidth`  | Image width must not exceed maximum   | image |
| `maxHeight` | Image height must not exceed maximum  | image |

## 📝 Examples

```html
<input type="file" ext=".jpg,.png" />
<input type="file" mimes="image/jpeg,image/png" />
<input type="file" max-size="1048576" />
<input type="file" min-width="400" />
<input type="file" min-height="300" />
<input type="file" max-width="1920" />
<input type="file" max-height="1080" />
```

## ▶️ Usage

```html
<form id="upload">
  <label>
    Avatar:
    <input type="file" name="avatar" ext=".jpg,.png" max-size="2097152" />
  </label>

  <label>
    Banner:
    <input type="file" name="banner" min-width="800" min-height="200" />
  </label>
</form>
```

```js
import { watchform, defineRules } from 'suriform'
import { fileRules } from 'suriform/rules'

const form = document.querySelector('#upload')
watchform(form)
defineRules(fileRules)
```
