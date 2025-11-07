---
title: Apha Rules Showcase
aside: false
---

# Apha Rules Showcase

::: tabs
== Demo
<AlphaDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { alphaRules } from 'suriform/rules'

defineRules(alphaRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::
