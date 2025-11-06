---
title: What is Suriform?
---

# What is Suriform?

Meet **Suriform** — a **framework-agnostic**, **client-side**, and **dependency-free** form validation framework. From the Filipino word `Suri`, meaning “Inspect” or “Validate”, Suriform is built to be **lightning-fast** and **effortless to use** — all while staying **ultra-light**.

## 🌿 Design Philosophy

Suriform is grounded in a **web-native philosophy** — it doesn’t try to replace how forms work; it enhances them. It is **HTML-first**, **declarative through attributes**, and designed to extend **native HTML5 validation** in a simple and intuitive way.

Rather than imposing abstractions or locking you into framework conventions, Suriform **embraces native HTML behavior** and gives you **modern power where it matters most** — messaging, localization, error handling, and event-driven control.

## 🧱 Familiar Usage

Suriform works **the way your forms already do** — no new syntax, no learning curve. It follows native browser conventions, keeping your markup familiar and semantic.

```html
<form>
  <input type="email" />
  <input type="number" max="10" step="2" />
  <input type="text" minlength="10" />
</form>
```

Defining **custom rules** feels just as natural. It **extends HTML attributes** in a way that’s instantly recognizable — keeping your forms declarative, readable, and consistent.

```html
<form>
  <input type="text" between="5,10" />
  <input type="text" contains="foo,bar" />
  <input type="text" name="foo" require-with="bar" />
  <input type="text" name="bar" />
</form>
```

## 🧭 The Suriform Way

- **Start with real HTML.**  
  No special components — just use forms and inputs like you always have.

- **Own your validation.**  
  No forced conventions — you decide how rules and messages behave.

- **No magic, no mystery.**  
  Explicit by design — what you code is exactly what the browser does.

## 🚀 Powerful System

- **The `Core`**:  
  Provides a powerful **rules engine**, flexibile **localization engine**, and APIs to get you started real quick, making it perfect for forms of any size — from small to large.

- **The `Tools`**:  
  Offers an extensive set of utilities designed to give developers **fine-grained control** over form behavior including error handling, feedbacks, lifecycle events and hooks.

- **The `Rules`**:  
  Delivers **50+ built-in validation rules** — including **files**, **dates**, **multi-selects**, **cross-field**, **required-types **, and full support for all **native browser rules**.

## ✨ Powerful Features

Suriform is packed with developer-focused features for building **dynamic**, **localized**, and **flexible** forms. Below is a quick overview — see the [**Features**](/guide/main-features) page for a full breakdown.

- 🧠 **Custom Rules** – Write complex async rules with dynamic messages
- ⚡ **Built-in Rules** - Use over 50 built-in rules with native support
- 💬 **Messaging** – Manage messages across rule, locale, and group levels
- 🌍 **Localization** – Granular locale control — globally and per-form
- ⚠️ **Error Handling** – Inline, popup, and summary error feedbacks
- 🧩 **Events & Hooks** – Extend behavior through validation lifecycle hooks
- 👁️ **Watchers** – Reactively observe and respond to form or field changes

## 🧪 Reliability & Testing

Suriform is built with a strong focus on **stability** and **test coverage**. It currently has **100% coverage** in **389 passing tests across 81 files**, ensuring every feature works as intended.
