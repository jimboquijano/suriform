---
title: Required Rules Showcase
aside: false
---

# Required Rules Showcase

::: tabs
== Demo
<RequiredDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { watchTarget } from 'suriform/tools'
import { requiredRules } from 'suriform/rules'

defineRules(requiredRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})

const watcher = watchTarget(formEl, [
  { reqif: ['reqifRef'] },
  { requn: ['requnRef'] },
  { reqwith: ['reqwithRef'] },
  { withall: ['withallRefA', 'withallRefB'] }
])
```

:::
