---
title: Rule Creation
---

# Rule Creation

Use and extend any **built-in rule** or define your own — **asynchronous** rules, **cross-field** rules, or even **required-type** rules that determine whether a field must be filled.

## 📝 Defining Rules

The `defineRule()` API requires a `name` string that is used to **delcare the rules** within the field. It also requires a `validate()` function that holds the validation logic. When not using a **locale source**, a **default message** must be supplied via `message`.

```js
defineRule('minlength', {
  validate: (value, [limit]) => {
    return value.length >= limit
  },
  message: 'The {field} must be at least {limit} characters long.'
})
```

## 📋 Declaring Rules

Delcare the **rule name** as HTML attributes, then use it to write your own logic. The `validate()` function gives you access to the field’s `value`, `params`, and `context`.

```html
<form>
  <input type="text" name="username" value="jim" />
  <input type="text" name="age" between="18,50" value="25" />
</form>
```

The `validate()` function for `between` accepts:

> - `value` → `25`
> - `params` → `[18,50]`
> - `context`:
>
> ```json
> {
>   "field": "username",
>   "type": "text",
>   "attrValue": "18,50",
>   "form": {
>     "username": "jim",
>     "age": "25"
>   }
> }
> ```

## ⚡ Built-in Rules

The `Rules` offers **50+ built-in validation rules** — including **files**, **dates**, **multi-selects**, **conditional requirements**, and full support for all **native browser rules**. Import each rule individually, import by group, or import all at once **(not recommended)**.

::: tabs
== per rule

```js
import { defineRule } from 'suriform'
import { min, max } from 'suriform/rules'

defineRule('min', min)
defineRule('max', max)
```

== by group

```js
import { defineRules } from 'suriform'
import { alphaRules, nativeRules } from 'suriform/rules'

defineRules(alphaRules)
defineRules(nativeRules)
```

> Please check the **Rules** section to learn more about the groupings.

== all rules

```js
import { defineRule } from 'suriform'
import { allRules } from 'suriform/rules'

defineRules(allRules)
```

:::

Each built-in rule are designed to be extended using **object spreading**. Override the `message`, change the `format`, or extend the `validator` however you want.
::: tabs
== message

```js
import { defineRule } from 'suriform'
import { min } from 'suriform/rules'

defineRule('min', {
  ...min,
  message: 'Value must be greater than or equal to {min}.'
})
```

== format

```js
import { defineRule } from 'suriform'
import { min } from 'suriform/rules'

defineRule('min', {
  ...min,
  format: (_, [min, max]) => {
    return { foo: min, bar: max }
  }
})
```

== validator

```js
import { defineRule } from 'suriform'
import { min } from 'suriform/rules'

defineRule('min', {
  ...min,
  validate: (value, [min]) => {
    // Add your logic here

    // Fallback if you need to
    return min.validate(value, [min])
  }
})
```

:::

## 🔄 Asynchronous Rules

Return a simple `boolean` result and use the rule’s **default message** or chain multiple conditions with **nested messages** to have a more **dynamic messaging**. Learn more information on how a **message is resolved** with the [Messaging](./messaging.md) guide.

::: tabs
== single message

```js
defineRule('username', {
  validate: async (value) => {
    const res = await fetch(`/api/check-username?u=${value}`)
    const data = await res.json()
    return data.available
  },
  message: 'The {field} is already taken.'
})
```

== nested messages

```js
defineRule('username', {
  validate: async (value) => {
    try {
      const res = await fetch(`/api/check-username?u=${value}`)
      const data = await res.json()

      if (!res.ok) {
        return data.message || 'Could not verify username. Please try again later.'
      }

      if (!data.available) {
        return data.message || 'This username is already taken.'
      }
    } catch (err) {
      return 'Network error — please try again.'
    }
  }
})
```

:::

## ↔️ Cross-Field Rules

Using the `checksTarget` flag, you can have access to the `FormData` inside the `context` object. This allows you to easily access the target field’s value for your logic.

```js
defineRule('match', {
  validate: (value, [target], { form }) => {
    return value == form[target]
  },
  checksTarget: true,
  message: 'Fields do not match.'
})
```

```html
<form>
  <input type="text" name="foo" match="bar" />
  <input type="text" name="bar" />
</form>
```

> 💡 Combine **cross-field** logic with **async rules** for complex validation scenarios.

## ✅ Required-Type Rules

With the `checksRequired` flag, the system registers the rule in a different `registry` that runs an additional `isFieldRequired()` check, dedicated to **required-type** rules. Learn more information about the **validation flow** with the [validateForm()](../../core/validate-form.md) API.

```js
defineRule('required-with', {
  validate: (_, [target], { form }) => {
    if (!target) return false
    return !!form[target]
  },
  checksTarget: true,
  checksRequired: true
})
```

```html
<form>
  <input type="text" name="foo" required-with="bar" />
  <input type="text" name="bar" />
</form>
```
