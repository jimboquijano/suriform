---
title: Select Rules Showcase
aside: false
---

# Select Rules Showcase

::: tabs
== Demo
<SelectDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { selectRules } from 'suriform/rules'

defineRules(selectRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::
