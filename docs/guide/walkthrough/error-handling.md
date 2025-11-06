---
title: Error Handling
---

# Error Handling

Manage **validation feedback** through multiple layers — from **inline messages** to **popups** and **summary lists**. Handle errors with **stateful hooks** and **custom rendering options**.

## 💬 Inline Errors

When a form field fails validation, an **error block** is created. These error blocks are handled internally and are **cached effeciently** for a faster render times. Both the field and the **error block** comes with **full ARIA support** for a better accesibility and reading.

### Supressing Inline

When a field is validated, the validator does not care about the `dirty` and `touched` state, it will **always process** the inline errors. To suppress this, add the `__sfInline` flag.

```js
const form = document.querySelector('#signup')
form.__sfInline = false
```

### Extending Inline

Use `extendMessage()` to easily **interpolate and transform** inline errors with your own custom template. Add extra processing and wrap the message anyway you like.

```js
const form = document.querySelector('#signup')
const ext = extendMessage(form)

message.wrapMessage(({ field, message }) => {
  return `<div class="my-error">[${field.name}] ${message}</div>`
})
```

## 💭 Error Popups

Use `handleErrors()` to easily display error popups with less boilerplate. For a better control, use `withPopup()` directly along with `useValidity` to interpolate each message.

::: tabs
== handleErrors

```js
const form = document.querySelector('#signup')
const errors = handleErrors(form, {
  withPopup: true
})
```

== withPopup

```js
const form = document.querySelector('#signup')
const validity = useValidity(formEl)
const popup = withPopup(formEl)

validity.onInvalid(({ field, message }) => {
  popup.addError(field, message)
})

validity.onInvalid(({ field }) => {
  popup.removeError(field)
})

validity.onFail((errors) => {
  popup.addErrors(errors)
})

validity.onPass(() => {
  popup.removeErrors()
})

validity.onReset(() => {
  popup.removeErrors()
})
```

:::

> 💡 Learn more about managing popup with the [`withPopup()`](../../tools/with-popup.md) API.

## 🧾 Summary List

Use `handleErrors()` to easily display summary list with less boilerplate. For a better control, use `withSummary()` directly along with `useValidity` to interpolate each message.

::: tabs
== handleErrors

```js
const form = document.querySelector('#signup')
const errors = handleErrors(form, {
  withSummary: true
})
```

== withSummary

```js
const form = document.querySelector('#signup')
const validity = useValidity(formEl)
const popup = withSummary(formEl)

validity.onInvalid(({ field, message }) => {
  popup.addError(field, message)
})

validity.onInvalid(({ field }) => {
  popup.removeError(field)
})

validity.onFail((errors) => {
  popup.addErrors(errors)
})

validity.onPass(() => {
  popup.removeErrors()
})

validity.onReset(() => {
  popup.removeErrors()
})
```

:::

> 💡 Learn more about managing summary with the [`withSummary()`](../../tools/with-summary.md) API.

## ⚠️ Error States

The `handleErrors()` tool is not just for **displaying feedbacks**. It also provides a full control to **track errors statefully**. Under the hood, it uses the `useValidity()` to observe the form.

```js
const form = document.querySelector('#login')
const errors = handleErrors(form)

errors.onAdd(({ field, message }) => {
  console.log(`Error on ${field.name}: ${message}`)
})

errors.onEmpty(() => {
  console.log('All errors cleared!')
})
```

> 💡 Learn more about handling error states with the [`handleErrors()`](../../tools/handle-errors.md) API.
