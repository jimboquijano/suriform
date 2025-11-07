---
title: File Rules Showcase
aside: false
---

# File Rules Showcase

::: tabs
== Demo
<FileDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { fileRules } from 'suriform/rules'

defineRules(fileRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::
