---
title: Use AJAX Showcase
aside: false
---

# Use AJAX Showcase

::: tabs
== Demo
<AjaxDemo />

== Code

```js
import { watchForm } from 'suriform'
import { useAjax } from 'suriform/tools'

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnSubmit: true,
  validateOnInput: true,
  stopOnFirstError: false
})

const ajax = useAjax(formEl)

ajax.onSuccess((response) => {
  formEl.reset()
  alert('Triggered onSuccess()')
  console.log(response)
})

ajax.onError((error) => {
  formEl.reset()
  alert('Triggered onError()')
  console.log(error)
})
```

:::

> Dummy API from: https://jsonplaceholder.typicode.com/posts
