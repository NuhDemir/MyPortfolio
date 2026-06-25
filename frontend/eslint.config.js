import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // ── Architecture guard: core/ cannot import from features/ or app/ ─────
  {
    files: ['src/core/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@features/*'],
            message: 'core/ cannot import from features/. Use dependency inversion.',
          },
          {
            group: ['@app/*'],
            message: 'core/ cannot import from app/. App depends on core, not vice versa.',
          },
        ],
      }],
    },
  },

  // ── Architecture guard: shared/ cannot import from features/ or app/ ───
  {
    files: ['src/shared/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@features/*'],
            message: 'shared/ cannot import from features/. Keep shared layer pure.',
          },
          {
            group: ['@app/*'],
            message: 'shared/ cannot import from app/. App depends on shared, not vice versa.',
          },
        ],
      }],
    },
  },
]
