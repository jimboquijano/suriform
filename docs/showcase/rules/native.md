---
title: Native Rules Showcase
aside: false
---

# Native Rules Showcase

::: tabs
== Demo
<NativeDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { nativeRules } from 'suriform/rules'

defineRules(nativeRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnSubmit: true,
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::
