---
title: defineRule()
---

# `defineRule(ruleName, rule)`

The `defineRule()` function globally registers a **custom validation** rule globally into the locale registry. Rules define the validation logic, message, and optional formatting.

## 📥 Import

```js
import { defineRule } from 'suriform'
```

## ▶️ Usage

```js
defineRule('minlength', {
  validate: (value, [limit]) => {
    return value.length >= limit
  },
  message: 'The {field} must be at least {limit} characters long.'
})
```

Use `defineRules()` to register multiple rules in a single call.

```js
import { defineRules } from 'suriform'

defineRules({
  required: {
    validate: (value) => !!value,
    message: 'The {field} field is required.'
  },
  email: {
    validate: (value) => /\S+@\S+\.\S+/.test(value),
    message: 'Enter a valid email address.'
  }
})
```

> 💡 Each rule in the object is automatically registered via `defineRule()` internally.

## 🧾 API

### `defineRule(ruleName, rule)`

| Parameter  | Type     | Required | Description                                                             |
| ---------- | -------- | -------- | ----------------------------------------------------------------------- |
| `ruleName` | `string` | Yes      | Unique identifier for the rule. Automatically normalized to kebab-case. |
| `rule`     | `Object` | Yes      | Rule definition containing validation logic and optional metadata.      |

### Rule Definition

| Property         | Type                | Default | Description                                                                                                        |
| ---------------- | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `validate`       | `Function`          | —       | The validation logic. Must return `true`, `false`, `string`, or a `Promise` resolving to one of these.             |
| `message`        | `string`            | —       | Optional default message shown when validation fails. Supports `{field}` and positional `{0}`, `{1}` placeholders. |
| `format`         | `Array \| Function` | `[]`    | Optional interpolation strategy for advanced message formatting.                                                   |
| `checksRequired` | `boolean`           | `false` | Marks the rule as a _requirement_ check. Used to determine if a field must be filled.                              |
| `checksTarget`   | `boolean`           | `false` | Enables access to `form` data, useful for cross-field validation.                                                  |

> ⚠️ Throws a `warning` if the definition is missing a valid `name` or `validate()` function.

## 🧾 Validate

### `validate(value, params, context)`

| Argument      | Type     | Description                |
| ------------- | -------- | -------------------------- |
| `value`       | `string` | The form field value.      |
| `params`      | `Array`  | Th parsed attribute value. |
| `context`     | `Object` | The object which contains: |
| → `field`     | `string` | The form field name.       |
| → `type`      | `string` | The form field type.       |
| → `attrValue` | `string` | The attribute value.       |
| → `form`      | `Object` | The optional `form` data.  |

Using `between` rule in this form:

```html
<form>
  <input type="text" name="username" value="jim" />
  <input type="text" name="age" between="18,50" value="25" />
</form>
```

The `validate()` function accepts:

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

## ↩️ Returns

`defineRule()` does not return anything. It updates the global `ruleRegistry` or the global `reqRegistry`, making the rule available immediately to all forms.

## ➡️ Internal Flow

1. `Rule Attribute` - Normalizes the rule name to **kebab-case** for consistency.
2. `Rule Registry` - Stores the rules in either `ruleRegistry` or `reqRegistry`.
3. `Rule Cache` - Resets the cache accordingly to ensure new rules are active.

### `Rule Registry`

| Registry       | Usage                        |
| -------------- | ---------------------------- |
| `ruleRegistry` | For regular validation rules |
| `reqRegistry`  | For required-type rules      |

## 🧠 Rule Execution

1. The field’s value and rule parameters are collected via `getContext()`.
2. The `validate()` accepts `(value, params, context)` and may return:
   - `true` → Field is valid
   - `false` → Invalid, use rule name for message lookup
   - `string` → Message key or direct error message
   - `Promise` → Async validation result

3. The system resolves and formats the final message through:
   - `resolveMessage()` → Handles localization and overrides
   - `formatMessage()` → Interpolates `{field}` and placeholders
