---
title: Group Message Showcase
aside: false
---

# Group Message Showcase

::: tabs
== Demo
<GroupDemo />

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

ext.groupMessage({
  rules: ['min-width', 'min-height', 'max-width', 'max-height'],
  message: 'Image must be of correct size.'
})
```

:::
