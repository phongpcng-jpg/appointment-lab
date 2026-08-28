import eslint from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**'] },
  eslint.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    ...react.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } }
    }
  },
  {
    files: ['**/*.jsx'],
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  }
];
