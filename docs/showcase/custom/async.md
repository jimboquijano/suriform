---
title: Asynchronous Rule Showcase
aside: false
---

# Asynchronous Rule Showcase

::: tabs
== Demo
<AsyncDemo />

== Code

```js
import { watchForm, defineRule } from 'suriform'
import { alphaRules } from 'suriform/rules'

defineRule('username', {
  async validate(value) {
    const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(value)}`)
    const data = await res.json()
    return data.users.length > 0
  },
  message: 'This username is already taken.'
})

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::

> Dummy API from: https://dummyjson.com/users
