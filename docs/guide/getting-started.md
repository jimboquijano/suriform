---
title: Getting Started
---

# Getting Started

Suriform **doesn’t lock you in.** You can let it handle everything for you using **easy-to-use APIs**, or use **only the parts you need.** Every piece is **modular** and works **independently.**

You can **start small and expand as you go.** This page walks you through the basics — from **installing Suriform**, to **setting up your first form**, to **writing your first custom rule.**

## 📦 Installation

Get Suriform via NPM:

```bash
npm install suriform
```

Or get the `Core` via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/suriform@latest/dist/suriform.umd.min.js"></script>
```

## 🧱 Extra Content

Get the optional `Tools` and `Rules`:

```html
<script src="https://cdn.jsdelivr.net/npm/suriform@latest/dist/suriform-tools.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/suriform@latest/dist/suriform-rules.umd.min.js"></script>
```

Or get the optional styles:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/suriform@latest/dist/suriform.css" />
```

> 💡 Wrap your `form` or any container with the `.suriform` class, to use the styles.

## 💨 Quick Start

Let Suriform **handle the listeners** for you via `watchForm()`. The system will connect your form and fields to the validation engine. Learn more about the [watchForm()](../core/watch-form.md) API.

```js
import { watchForm, defineRule } from 'suriform'
import { contains } from 'suriform/rules'

defineRule('contains', contains)
const form = document.getElementById('#form')
const sf = watchForm(form)
```

Alternatively, Suriform allows you to run `validateForm()` on demand and handle the listeners yourself for more control. Learn more about the [validateForm()](../core/validate-form.md) API.

```js
import { validateForm, defineRule } from 'suriform'
import { contains } from 'suriform/rules'

defineRule('contains', contains)
const form = document.getElementById('#form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const result = await validateForm(form)
  if (result.isValid) form.submit()
})
```

UMD users can do the same, either use the `watchForm()` or `validateForm()`.

```html
<script>
  suriform.defineRule('contains', suriformRules.contains)
  const form = document.getElementById('#form')
  const sf = suriform.watchForm(form)
</script>
```

> 💡 CDN bundles the system to `suriform`, `suriformRules` and `suriformTools` objects.

## 🧾 Form Setup

Surifom’s [design philisopy](../guide/what-is-suriform.html#🌿-design-philosophy) centers around enhancing your native forms. In the setup below, a form field uses the `contains` rule that was defined via `defineRule`. Rules are **defined** in the code, and **declared** in the fields. Its works **exactly the way your forms already do**.

```html
<form id="form">
  <input type="text" contains="suriform" required />
  <button type="submit">Submit</button>
</form>
```

> ⚠️ Suriform includes `required` by default, so you don’t need to define it manually.

## 🧠 Custom Rule

Suriform gives you a clean and declarative API to **create your own rules** or **use built-in rules**. In the example below, we define a built-in rule `match` and a custom rule `nice`.

```js
import { watchForm, defineRule } from 'suriform'
import { match } from 'suriform/rules'

defineRule('nice', {
  validate: (value) => {
    return value == 'sixty9' ? false : true
  },
  message: '( ͡° ͜ʖ ͡°)ﾉ⌐■-■  NICE!'
})

defineRule('match', match)
const form = document.getElementById('#form')
const sf = watchForm(form)
```

```html
<form id="form">
  <input type="text" match="sixty7" nice required />
  <button type="submit">Submit</button>
</form>
```

> 💡 Want to go deeper? Check out the [Rule Creation](../features/rule-creation.md) guide for a full walkthrough.
