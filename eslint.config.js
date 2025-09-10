import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type'
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before'
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@shared/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@components/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@hooks/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@utils/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@types/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@leads/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@opportunities/**',
              group: 'internal',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          distinctGroup: false
        }
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/first': 'error',
    },
  },
]);
