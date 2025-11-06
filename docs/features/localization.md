---
title: Localization
---

# Localization

Translate **rule messages** and **field names** into different languages by defining locale sources and switching the active locale. Validation feedback automatically adapts.

## 🌐 Locale Source

The `localize()` API requires a **locale source** to be used globally to all forms. The locale source stores a list of localized `names` and `messages` defined by a `lookup key`.

```json
{
  "messages": {
    "required": "Ce champ est obligatoire.",
    "email": "Veuillez entrer une adresse e-mail valide."
  },
  "names": {
    "username": "Nom d’utilisateur",
    "email": "Adresse e-mail"
  }
}
```

> The following sources contain all the localized messages for the built-in rules. Use them directly, or as a reference for creating other locale source: [English](../public/locale/en.json), [French](../public/locale/fr.json)

## 📦 Apply Locale

Import from an **external json** file or **declare it directly** inside your code. Importing from an external source allows you to maintain your code easily and avoid code clutter.

::: tabs
== external

```json
{
  "messages": {
    "required": "Ce champ est obligatoire."
  }
}
```

```js
import fr from 'somewhere'
localize({ fr })

const form = document.getElementById('#form')
setLocale('fr')
validateForm(form)
```

== direct

```js
localize({
  jp: {
    messages: {
      required: 'このフィールドは必須です。'
    }
  }
})

const form = document.getElementById('#form')
setLocale('jp')
validateForm(form)
```

:::

## 💬 Rule Message

The resolver uses the `locale code` and `message key` to localize a message. In the example below, `fr` and `required` will be used, resulting to: **“Ce champ est obligatoire.”**

```js
localize({
  fr: {
    messages: {
      required: 'Ce champ est obligatoire.'
    }
  }
})

const form = document.getElementById('#form')
setLocale('fr')
validateForm(form)
```

```html
<form id="form">
  <input type="text" required />
</form>
```

> ⚠️ Suriform includes `required` by default, so you don’t need to define it manually.

## 🏷️ Field Name

The resolver uses the `locale code` and `name key` to localize a name. In the example below, `fr` and `email` will be used, resulting to: **“Veuillez entrer une Adresse e-mail valide.”**

```js
localize({
  fr: {
	messages: {
		email: 'Veuillez entrer une {field} valide.'
	}
    names: {
      email: 'Adresse e-mail'
    }
  }
})

const form = document.getElementById('#form')
setLocale('fr')
validateForm(form)
```

```html
<form id="form">
  <input type="email" name="email" required />
</form>
```
