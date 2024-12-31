// @ts-check

import eslint from '@eslint/js'
import jestPlugin from 'eslint-plugin-jest'
import { flatConfigs as importConfigs } from 'eslint-plugin-import'
import nodePlugin from 'eslint-plugin-n'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReact from 'eslint-plugin-react'

export default tseslint.config(
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],

    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      jestPlugin.configs['flat/recommended'],
      // @ts-ignore
      pluginReact.configs.flat.recommended,
      // @ts-ignore
      pluginReact.configs.flat['jsx-runtime'],
      importConfigs.recommended,
      importConfigs.typescript,
      eslintConfigPrettier,
    ],

    plugins: {
      // @ts-ignore
      'react-hooks': pluginReactHooks,
    },

    rules: {
      'no-restricted-imports': ['error', { patterns: ['**/shared/**'] }],
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false },
      ],
      'import/namespace': 'off',
      'import/no-duplicates': ['error'],
      'import/no-extraneous-dependencies': ['error'],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
        },
      ],
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      ...pluginReactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'import/no-unresolved': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: jestPlugin.environments.globals.globals,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    files: ['*.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  {
    files: ['config/**'],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: false },
      ],
    },
  },

  {
    files: ['shared/**'],
    extends: [nodePlugin.configs['flat/recommended-module']],
    rules: {
      'import/no-nodejs-modules': 'error',
      'n/no-missing-import': 'off',
    },
  },

  {
    files: ['frontend/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['**/shared/src/**', '@mdi/js'] },
      ],
      'import/no-nodejs-modules': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    },
  },

  {
    files: ['backend/**', 'shared/scripts/**'],
    extends: [nodePlugin.configs['flat/recommended-module']],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: false },
      ],
      'import/no-nodejs-modules': 'off',
      'no-process-exit': 'off',
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
    },
  }
)
