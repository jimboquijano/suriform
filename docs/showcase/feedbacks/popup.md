---
title: Error Popups Showcase
aside: false
---

# Error Popups Showcase

::: tabs
== Demo
<PopupDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { handleErrors } from 'suriform/tools'
import { alphaRules } from 'suriform/rules'

defineRules(alphaRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})

const errors = handleErrors(formEl, {
  withPopup: true
})
```

:::
