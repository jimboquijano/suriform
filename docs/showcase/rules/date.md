---
title: Date Rules Showcase
aside: false
---

# Date Rules Showcase

::: tabs
== Demo
<DateDemo />

== Code

```js
import { watchForm, defineRules } from 'suriform'
import { watchTarget } from 'suriform/tools'
import { dateRules } from 'suriform/rules'

defineRules(dateRules)

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnSubmit: true,
  validateOnInput: true,
  stopOnFirstError: false
})

// prettier-ignore
const watcher = watchTarget(formEl, [
	{ bstartdate: 'benddate' }, 
	{ aenddate: 'astartdate' }
  ])
```

:::
