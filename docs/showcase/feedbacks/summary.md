---
title: Summary List Showcase
aside: false
---

# Summary List Showcase

::: tabs
== Demo
<SummaryDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { handleErrors } from 'suriform/tools'
import { alphaRules } from 'suriform/rules'

defineRules(alphaRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnSubmit: true,
  validateOnInput: true,
  stopOnFirstError: false
})

const errors = handleErrors(formEl, {
  withSummary: true
})
```

:::
