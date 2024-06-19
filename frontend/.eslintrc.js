module.exports = {
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: [
      'react',
    ],
    rules: {
      'no-unused-vars': ['error', { 'varsIgnorePattern': '^_' }],
      // Add more rules as needed
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  