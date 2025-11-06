import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import AlphaDemo from './components/Rules/AlphaDemo.vue'
import CompareDemo from './components/Rules/CompareDemo.vue'
import DateDemo from './components/Rules/DateDemo.vue'
import FileDemo from './components/Rules/FileDemo.vue'
import NativeDemo from './components/Rules/NativeDemo.vue'
import NumberDemo from './components/Rules/NumberDemo.vue'
import RequiredDemo from './components/Rules/RequiredDemo.vue'
import SelectDemo from './components/Rules/SelectDemo.vue'
import StringDemo from './components/Rules/StringDemo.vue'
import AjaxDemo from './components/Hooks/AjaxDemo.vue'
import ValidityDemo from './components/Hooks/ValidityDemo.vue'
import AsyncDemo from './components/Custom/AsyncDemo.vue'
import ConditionalDemo from './components/Custom/ConditionalDemo.vue'
import PopupDemo from './components/Feedbacks/PopupDemo.vue'
import SummaryDemo from './components/Feedbacks/SummaryDemo.vue'
import ErrorsDemo from './components/Feedbacks/ErrorsDemo.vue'
import LocaleDemo from './components/Messaging/LocaleDemo.vue'
import GroupDemo from './components/Messaging/GroupDemo.vue'
import WrapDemo from './components/Messaging/WrapDemo.vue'
import '../styles/index.scss'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('AlphaDemo', AlphaDemo)
    app.component('CompareDemo', CompareDemo)
    app.component('DateDemo', DateDemo)
    app.component('FileDemo', FileDemo)
    app.component('NativeDemo', NativeDemo)
    app.component('NumberDemo', NumberDemo)
    app.component('RequiredDemo', RequiredDemo)
    app.component('SelectDemo', SelectDemo)
    app.component('StringDemo', StringDemo)
    app.component('AjaxDemo', AjaxDemo)
    app.component('ValidityDemo', ValidityDemo)
    app.component('AsyncDemo', AsyncDemo)
    app.component('ConditionalDemo', ConditionalDemo)
    app.component('PopupDemo', PopupDemo)
    app.component('SummaryDemo', SummaryDemo)
    app.component('ErrorsDemo', ErrorsDemo)
    app.component('LocaleDemo', LocaleDemo)
    app.component('GroupDemo', GroupDemo)
    app.component('WrapDemo', WrapDemo)
    enhanceAppWithTabs(app)
  }
}
