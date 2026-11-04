import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'assets/vendor/**', 'docs/**', '.claude/**'],
  },
  js.configs.recommended,

  // Browser code
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Architecture rule: core/ may never import from desktop/ or mobile/
  {
    files: ['js/core/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/desktop/**', '**/mobile/**'],
              message: 'core/ must not import from desktop/ or mobile/ (see AGENTS.md).',
            },
          ],
        },
      ],
    },
  },

  // Node scripts and this config file
  {
    files: ['scripts/**/*.mjs', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
];
