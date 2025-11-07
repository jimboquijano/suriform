import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  title: 'Suriform',
  description: 'The Form Validation for the Modern Web.',
  base: '/suriform/',
  appearance: 'dark',
  head: [['link', { rel: 'icon', type: 'image/x-icon', href: '/suriform/favicon.ico' }]],
  themeConfig: {
    siteTitle: 'Suriform',
    logo: {
      light: '/logo-36.png',
      dark: '/logo-36.png',
      alt: 'Suriform logo'
    },
    nav: [
      { text: 'Get Started', link: '/guide/getting-started' },
      { text: 'Guide', link: '/guide/walkthrough/rule-creation' },
      { text: 'API', link: '/core/watch-form' },
      { text: 'Showcase', link: '/showcase/rules/native' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          collapsed: true,
          items: [
            { text: 'What is Suriform?', link: '/guide/what-is-suriform' },
            { text: 'Main Features', link: '/guide/main-features' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            {
              text: 'Walkthrough',
              items: [
                { text: 'Rule Creation', link: '/guide/walkthrough/rule-creation' },
                { text: 'Messaging', link: '/guide/walkthrough/messaging' },
                { text: 'Formatting', link: '/guide/walkthrough/formatting' },
                { text: 'Localization', link: '/guide/walkthrough/localization' },
                { text: 'Error Handling', link: '/guide/walkthrough/error-handling' }
              ]
            }
          ]
        },
        {
          text: 'Core',
          collapsed: true,
          items: [
            { text: 'watchForm()', link: '/core/watch-form' },
            { text: 'validateForm()', link: '/core/validate-form' },
            { text: 'resetForm()', link: '/core/reset-form' },
            { text: 'defineRule()', link: '/core/define-rule' },
            { text: 'localize()', link: '/core/localize' }
          ]
        },
        {
          text: 'Tools',
          collapsed: true,
          items: [
            { text: 'useValidity()', link: '/tools/use-validity' },
            { text: 'useAjax()', link: '/tools/use-ajax' },
            { text: 'handleErrors()', link: '/tools/handle-errors' },
            { text: 'firstError()', link: '/tools/first-error' },
            { text: 'withSummary()', link: '/tools/with-summary' },
            { text: 'withPopup()', link: '/tools/with-popup' },
            { text: 'extendMessage()', link: '/tools/extend-message' },
            { text: 'watchTarget()', link: '/tools/watch-target' }
          ]
        },
        {
          text: 'Rules',
          collapsed: true,
          items: [
            { text: 'nativeRules', link: '/rules/native' },
            { text: 'alphaRules', link: '/rules/alpha' },
            { text: 'stringRules', link: '/rules/string' },
            { text: 'numberRules', link: '/rules/number' },
            { text: 'compareRules', link: '/rules/compare' },
            { text: 'dateRules', link: '/rules/date' },
            { text: 'fileRules', link: '/rules/file' },
            { text: 'selectRules', link: '/rules/select' },
            { text: 'requiredRules', link: '/rules/required' }
          ]
        },
        {
          text: 'Showcase',
          collapsed: true,
          items: [
            {
              text: 'Custom Rules',
              items: [
                { text: 'Asynchronous', link: '/showcase/custom/async' },
                { text: 'Conditional', link: '/showcase/custom/conditional' }
              ]
            },
            {
              text: 'Feedbacks',
              items: [
                { text: 'Error Popups', link: '/showcase/feedbacks/popup' },
                { text: 'Summary List', link: '/showcase/feedbacks/summary' },
                { text: 'Combination', link: '/showcase/feedbacks/errors' }
              ]
            },
            {
              text: 'Messaging',
              items: [
                { text: 'Switch Locale', link: '/showcase/messaging/locale' },
                { text: 'Group Message', link: '/showcase/messaging/group' },
                { text: 'Wrap Inline', link: '/showcase/messaging/wrap' }
              ]
            },
            {
              text: 'Hooks & Events',
              items: [
                { text: 'AJAX Hooks', link: '/showcase/hooks/ajax' },
                { text: 'Validity Hooks', link: '/showcase/hooks/validity' }
              ]
            },
            {
              text: 'Rules Group',
              items: [
                { text: 'Native Rules', link: '/showcase/rules/native' },
                { text: 'Alpha Rules', link: '/showcase/rules/alpha' },
                { text: 'String Rules', link: '/showcase/rules/string' },
                { text: 'Number Rules', link: '/showcase/rules/number' },
                { text: 'Compare Rules', link: '/showcase/rules/compare' },
                { text: 'Date Rules', link: '/showcase/rules/date' },
                { text: 'File Rules', link: '/showcase/rules/file' },
                { text: 'Select Rules', link: '/showcase/rules/select' },
                { text: 'Required Rules', link: '/showcase/rules/required' }
              ]
            }
          ]
        },
        {
          text: 'Community',
          collapsed: true,
          items: [
            { text: 'Contributing', link: '/community/contributing' },
            { text: 'Changelog', link: '/community/changelog' },
            { text: 'FAQ', link: '/community/faq' }
          ]
        }
      ]
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Jimbo Quijano'
    }
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  }
})
