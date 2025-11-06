---
title: Use Validity Showcase
aside: false
---

# Use Validity Showcase

::: tabs
== Demo
<ValidityDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { useValidity } from 'suriform/tools'
import { alphaRules } from 'suriform/rules'

defineRules(alphaRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnSubmit: true,
  validateOnInput: true,
  stopOnFirstError: false
})

const validity = useValidity(formEl)
const popup = withPopup(formEl)

validity.onInvalid(({ field, message }) => {
  popup.addError(field, message)
})

validity.onInvalid(({ field }) => {
  popup.removeError(field)
})

validity.onFail((errors) => {
  popup.addErrors(errors)
})

validity.onPass(() => {
  popup.removeErrors()
})

validity.onReset(() => {
  popup.removeErrors()
})
```

:::
