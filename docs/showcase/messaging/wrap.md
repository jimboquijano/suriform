---
title: Wrap Inline Showcase
aside: false
---

# Wrap Inline Showcase

::: tabs
== Wrap
<WrapDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { extendMessage } from 'suriform/tools'
import { fileRules } from 'suriform/rules'

defineRules(fileRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})

const ext = extendMessage(formEl)

ext.wrapMessage(({ message }) => {
  return `<div class="my-error" style="background:blue">${message}</div>`
})
```

:::
