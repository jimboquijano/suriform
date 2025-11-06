---
title: Main Features
---

# Main Features

Suriform provides a **flexible toolkit** for form handling — **rules**, **messages**, **localization**, and **feedback** — all **under your control.** Use as much or as little as you need, and everything **works together seamlessly.** Explore the main features that set Suriform apart.

## 🧠 **Custom Rules**

- **Chain** multiple or nested conditions within a single rule
- **Return** dynamic messages based on those conditions
- **Write** async rules seamlessly — even with multiple conditions
- **Reference** single or multiple fields for cross-field validation
- **Handle** dynamic required states using other field values
- **Add** custom formatters to fine-tune your validation messages

## ⚡ **Built-in Rules**

- **Use** over 50 built-in rules, including native browser rules
- **Extend** built-in rules with your own validation and message
- **Import** built-in rules individually, by group or all at once

## 💬 **Messaging**

- **Control** messages at multiple levels: Rule, Locale, & Group
- **Format** `{tokens}` consistently using: Positional & Key–value
- **Wrap** inline errors using the `wrapMessage` tool for templating.
- **Group** rules with the `groupMessage` tool for unified messaging.

## 🌍 **Localization**

- **Define** a global locale object with field names and messages
- **Localize** any message by replacing it with a `message key`
- **Localize** any field by using the name as the `name key`
- **Switch** locales with ease — globally or per form
- **Detect** the initial locale automatically during setup
- **Fallback** intelligently when locale or keys are missing

## ⚠️ **Error Handling**

- **Display** popup feedback using the `withPopup` tool
- **Show** summary feedback using the `withSummary` tool
- **Track** error states on: add, remove, change, collect, & empty

## 🧩 **Events & Hooks**

- **Handle** form submissions and async requests with the `useAjax` hook
- **Control** validation lifecycle and timing using the `useValidity` hook
- **Manage** error events efficiently through the `useErrors` hook

## 👁️ **Watchers**

- **Observe** forms and fields using the main `watchForm` API
- **Auto-validate** related fields using the `watchTarget` tool
- **Auto-observe** fields that have been added dynamically
