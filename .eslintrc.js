module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'next',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'import', 'jsx-a11y'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'error',
    'react/jsx-props-no-spreading': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-shadow': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/require-default-props': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'object', 'index']],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['jest.setup.ts', '**/*.test.tsx', '**/*.spec.tsx', '**/*.test.ts', '**/*.spec.ts'] },
    ],
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {
        project: '.',
      },
    },
  },
};
