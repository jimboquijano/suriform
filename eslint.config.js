import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'quote-props': ['consistent-as-needed']
    }
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended
]
