---
title: Compare Rules Showcase
aside: false
---

# Compare Rules Showcase

::: tabs
== Demo
<CompareDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { compareRules, strong } from 'suriform/rules'

const nice = {
  message: '( ͡° ͜ʖ ͡°)ﾉ⌐■-■  NICE!',
  validate: (value) => {
    return value == 'sixty9' ? false : true
  }
}

defineRules({ ...compareRules, nice, strong })

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::
