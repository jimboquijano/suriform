---
title: Number Rules Showcase
aside: false
---

# Number Rules Showcase

::: tabs
== Demo
<NumberDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { numberRules } from 'suriform/rules'

defineRules(numberRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnSubmit: true,
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::
