---
title: Formatting
---

# Formatting

Use placeholders for **dynamic message formatting** — when a rule fails, all the placeholders within the **message string** are interpolated and replaced with contextual values.

## 🏷️ Placeholders

The placeholders are token-like strings that will be **interpolated** by the resolver. The type of interpolation depends on the rule’s `format` type. An array `format` interpolates sequentially using array positions. A `format()` function interpolates explicitly named placeholders.

| Placeholder         | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| `{field}`           | The human-readable field name (localized or prettified).   |
| `{0}`, `{1}`, …     | Sequential placeholders used for positional interpolation. |
| `{foo}`, `{bar}`, … | Explicit placeholders used for key-value interpolation.    |

### 💡 Notes

- The `{field}` placeholder is a reserved token and will **always be skipped** during positional interpolation regardless of where it is placed in the message string.
- By default, the resolver uses an array `format` and **positional interpolation**.

## 🔣 Interpolation

### 1. Positional

In the example below, the `array` is mapped to the placeholders based on **their sequential order**. The first item `5` will be mapped to the first placeholder `{0}`. The name **does not matter**, renaming `{0}` to other names will not change the result.

```text
The {field} must be between {0} and {1}.
```

```json
[5, 10]
```

### 2. Key-Value

In the example below, the `object` is mapped to the placeholders by `key` and name. The `min` property `5` will be mapped to the placeholder named `{min}`.

```text
The {field} must be between {min} and {max}.
```

```json
{
  "min": 5,
  "max": 10
}
```

## 🔤 Format Function

The `format()` function uses **key-value interpolation** to resolve the final message.

```js
defineRule('between', {
  validate: (value, [min, max]) => {
    return value >= min && value <= max
  },
  format: (_, [min, max]) => {
    return { foo: min, bar: max }
  },
  message: '{field} must be between {foo} and {bar}.'
})
```

> **1. Formatter:**
>
> ```js
> formatKeyValue(message, field, keyValue)
> ```
>
> **2. Data:**
>
> - `keyValue` = `{'foo':3, 'bar':10}`
> - `{foo}` → `3`
> - `{bar}` → `10`.
>
> **3. Result:**  
> “Age must be between 3 and 10.”

## 🔢 Array Format

The array `format` uses the **positional interpolation** to resolve the final message.

```js
defineRule('between', {
  validate: (value, [min, max]) => {
    return value >= min && value <= max
  },
  format: ['foo', 'bar'],
  message: '{field} must be between {foo} and {bar}.'
})
```

> **1. Formatter:**
>
> ```js
> formatPositional(message, field, params, format)
> ```
>
> **2. Data:**
>
> - `params` = `['3', '10']`
> - `format` = `['foo', 'bar']`
> - `{foo}` → `params[0]`
> - `{bar}` → `params[1]`.
>
> **3. Result:**
>
> “Age must be between 3 and 10”

## 🔂 Overriding

If a **group handler** is set and returns an object, the resolver **merges those values** before final interpolation, allowing dynamic or localized messages to adapt to context.

```js
{
  message: 'The {field} must be at least {limit} items.',
  params: [5],
  format: ['limit']
}

```
