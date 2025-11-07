---
title: String Rules Showcase
aside: false
---

# String Rules Showcase

::: tabs
== Demo
<StringDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { stringRules } from 'suriform/rules'

defineRules(stringRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::
