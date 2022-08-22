module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'sort-keys-fix',
    'typescript-sort-keys',
  ],
  root: true,
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    'arrow-body-style': ['error', 'always'],
    'class-methods-use-this': 'off',
    curly: ['error', 'all'],
    'import/exports-last': 'error',
    'import/no-unresolved': 'error',
    'import/prefer-default-export': 'off',
    'max-len': [
      'error',
      80,
      {
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'newline-before-return': 'error',
    'no-multiple-empty-lines': 'error',
    'object-curly-newline': [
      'error',
      {
        ExportDeclaration: {
          multiline: true,
        },
        ImportDeclaration: {
          multiline: true,
        },
        ObjectExpression: {
          minProperties: 1,
          multiline: true,
        },
        ObjectPattern: {
          multiline: true,
        },
      },
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: true,
        minKeys: 2,
        natural: false,
      },
    ],
    'sort-keys-fix/sort-keys-fix': 'warn',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.module', '.guard', '.decorator'],
      },
    },
  },
};
