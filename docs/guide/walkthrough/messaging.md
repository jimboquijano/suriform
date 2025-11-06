---
title: Messaging
---

# Messaging

Manage and format messages consistently across **rules**, **locales**, and **groups**. Ensure clarity through **structured placeholders** and **organized grouping** for related rules.

## 🧠 Rule Level

Resolving a message when a **field fails** goes through different levels – **group**, **locale** and **rule**. Without a group handler or a locale source, the resolver falls back to the rule. The most common way is using the `message` property – the **default message**.

```js
defineRule('minlength', {
  validate: (value, [limit]) => {
    return value.length >= limit
  },
  message: 'The {field} must be at least {limit} characters long.'
})
```

Another common way is through an **explicit message**. Return a **single message** or chain multiple conditions with **nested messages** for a more **dynamic messaging**.

::: tabs
== single message

```js
defineRule('maxlength', {
  validate: (value, [limit]) => {
    if (value.length > limit) {
      return 'The {field} must be no more than {limit} characters long.'
    }
  }
})
```

== nested message

```js
defineRule('between', {
  validate: (value, [min, max]) => {
    if (value < min) {
      return 'Must be greater than or equal to {min}.'
    }

    if (value > max) {
      return 'Must be less than or equal to {max}.'
    }

    return true
  }
})
```

:::

## 🌐 Locale Level

With a locale source, a `false` result will be converted into a `resultKey`. This key is used to lookup a locale source and retrieve its **localized message** when available. A `resultKey` can be returned directly as well, which will have the same effect.

::: tabs
== false result

```js
defineRule('minlength', {
  validate: (value, [limit]) => {
    return value.length >= limit
  }
})

const fr = {
  names: {},
  messages: {
    minlength: 'Le {field} doit contenir au moins {limit} caractères.'
  }
}

localize({ fr })
```

== resultKey

```js
defineRule('maxlength', {
  validate: (value, [limit]) => {
    if (value.length < limit) {
      return 'maxlength'
    }
  }
})

const fr = {
  names: {},
  messages: {
    maxlength: 'Le champ {field} ne doit pas dépasser {limit} caractères.'
  }
}

localize({ fr })
```

:::

## 🗃️ Group Level

The **group handler** will act as an override to **any defined messages**. It can also return either an **explicit message** or a `resultKey` which resolves to a localized message.

::: tabs
== message

```js
defineRule('minlength', {
  validate: (value, [limit]) => {
    return value.length >= limit
  }
})

defineRule('maxlength', {
  validate: (value, [limit]) => {
    return value.length <= limit
  }
})

const ext = extendMessage(formEl)

ext.groupMessage({
  rules: ['minlength', 'maxlength'],
  message: 'Length of {field} must be between {minlength} and {maxlength}.'
})
```

== resultKey

```js
defineRule('minlength', {
  validate: (value, [limit]) => {
    return value.length >= limit
  }
})

defineRule('maxlength', {
  validate: (value, [limit]) => {
    return value.length <= limit
  }
})

const ext = extendMessage(formEl)

ext.groupMessage({
  rules: ['minlength', 'maxlength'],
  message: 'betweenlength'
})
```

:::

## 💬 Resolving

The resolver follows a **structured flow** to determine the final message for a rule. This process ensures that **localization, group handlers, and fallbacks** are applied consistently.

### 1. `resultKey` Resolution

When evaluating a rule, the `resultKey` is determined to **resolve the final message**:

| Rule Result | Action                                                                   |
| ----------- | ------------------------------------------------------------------------ |
| `false`     | `resultKey` becomes the **rule name**, then `resolveMessage()` is called |
| `string`    | The string is used as `resultKey` and passed to `resolveMessage()`       |

---

### 2. `resolveMessage` Logic

The resolver behaves differently depending on whether a **group handler** is present:

| Handler | Summary                                                                           |
| ------- | --------------------------------------------------------------------------------- |
| Yes     | Retrieve context via handler, localize the message, and return the context.       |
| No      | Return either the localized message, default message, or a fallback if undefined. |

> #### ✅ With Handler
>
> - Retrieve the **context** through the group handler.
> - Localize the message within the context using `i18n.getMessage()`.
> - Return the **context object** immediately w/o further processing.
>
> #### ❌ Without Handler
>
> - Localize the `resultKey` using `i18n.getMessage()`.
>
> | Localize Result        | Rule Message | Action                                        |
> | ---------------------- | ------------ | --------------------------------------------- |
> | `string` != 'ruleName' | N/A          | Return the **localized message**              |
> | `string` == 'ruleName' | Yes          | Fallback to the rule’s **rule message**       |
> | `string` == 'ruleName' | No           | Fallback to `"The {field} field is invalid."` |

### 💡 Notes

- The **default message** is the `message` attribute defined under `defineRule()`.
- **Group handlers** allow dynamic or contextual messages for a set of rules.
- Fallbacks ensure that a message is **always available**, even if localization is missing.
- This system works seamlessly with the **formatting system** [described here](./formatting.md).
