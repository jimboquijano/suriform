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
    if (!value) return true

    try {
      const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(value)}`)

      if (!res.ok) {
        return 'Could not verify username. Please try again later.'
      }

      const data = await res.json()
      const exists = data.users?.some((u) => u.username.toLowerCase() === value.toLowerCase())

      if (exists) {
        return 'This username is already taken.'
      }

      return true
    } catch (err) {
      return 'Network error — please try again.'
    }
  },
  message: 'Invalid username.'
})

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnSubmit: true,
  validateOnInput: true,
  stopOnFirstError: false
})
```

:::

> Dummy API from: https://dummyjson.com/users
