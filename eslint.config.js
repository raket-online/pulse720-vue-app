import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  // JavaScript recommended config
  js.configs.recommended,

  // Vue 3 recommended config
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        confirm: 'readonly',
        // DOM types
        HTMLInputElement: 'readonly',
        File: 'readonly',
        Event: 'readonly',
        DragEvent: 'readonly',
        // Node globals for config files
        process: 'readonly',
        __dirname: 'readonly',
        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Vue specific rules
      'vue/multi-word-component-names': 'off', // Allow single word component names
      'vue/no-v-html': 'warn', // Warn about v-html (XSS risk)
      'vue/require-default-prop': 'off', // TypeScript handles this
      'vue/require-prop-types': 'off', // TypeScript handles this

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Warn about any usage
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // General JavaScript/TypeScript rules
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }], // Warn about console.log
      'no-debugger': 'warn',
      'no-unused-vars': 'off', // Handled by @typescript-eslint
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'], // Require === and !==
    },
  },

  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      '*.config.js',
      '*.config.ts',
      '.vscode/**',
      '.idea/**',
    ],
  },
]
