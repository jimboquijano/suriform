---
title: localize()
---

# `localize(locales)`

The `localize()` function registers one or more **locale sources** globally into the locale registry. It enables **multi-language support** for validation messages and field names.

## 📥 Import

```js
import { localize } from 'suriform'
```

## ▶️ Usage

```js
localize({
  fr: {
    messages: {
      required: 'Ce champ est obligatoire.',
      email: 'Veuillez entrer une adresse e-mail valide.'
    },
    names: {
      username: 'Nom d’utilisateur',
      email: 'Adresse e-mail'
    }
  }
})
```

## ▶️ Setting

Use `setLocale()` to set the **current locale** globally or per form.

```js
import { setLocale } from 'suriform'
setLocale('fr')

const form = document.getElementById('#form')
setLocale('jp', form)
```

> 💡 Setting a locale per form **revalidates** all invalid fields within that form.

## 🧾 API

### `localize(locales)`

| Parameter | Type                                    | Required | Description                                                       |
| --------- | --------------------------------------- | -------- | ----------------------------------------------------------------- |
| `locales` | `Record<string, Record<string,string>>` | Yes      | A map of locale codes (e.g. `en`, `fr`) to their message sources. |

> ⚠️ Throws a `warning` if a locale source is invalid (e.g. not an object).

## ↩️ Returns

`localize()` does not return anything. It updates the global `localeRegistry`, making the provided translations available immediately to all forms.

## ➡️ Internal Flow

1. Iterates over all provided locales and merges them in the registry.
2. Merges nested objects recursively to preserve existing translations.
3. Initializes missing locale entries automatically.
4. Ignores invalid entries and logs a console error.
