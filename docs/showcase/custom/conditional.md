---
title: Conditional Rule Showcase
aside: false
---

# Conditional Rule Showcase

::: tabs
== Demo
<ErrorsDemo />

== Code

```js
import { watchForm, defineRule } from 'suriform'
import { watchTarget } from 'suriform/tools'
import { alphaRules } from 'suriform/rules'

defineRule('match', {
  validate: (value, [target], { form }) => {
    return value == form[target]
  },
  checksTarget: true,
  message: 'Fields do not match.'
})

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnSubmit: true,
  validateOnInput: true,
  stopOnFirstError: false
})

const watcher = watchTarget(formEl, [{ foo: 'bar' }])
```

:::
