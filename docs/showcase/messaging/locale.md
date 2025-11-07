---
title: Switch Locale Showcase
aside: false
---

# Switch Locale Showcase

::: tabs
== Demo
<LocaleDemo />

== Code

```js
import { watchForm, defineRules, localize, setLocale } from 'suriform'
import { alphaRules } from 'suriform/rules'
import en from 'https://jimboquijano.github.io/suriform/locale/en.json'
import fr from 'https://jimboquijano.github.io/suriform/locale/fr.json'

defineRules(alphaRules)
localize({ en, fr })

const formEl = document.getElementById('formEl')
const sf = watchForm(formEl, {
  validateOnInput: true,
  stopOnFirstError: false
})

document.getElementById('localechange').addEventListener('change', (e) => {
  setLocale(e.target.value)
})
```

:::
