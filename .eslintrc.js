module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ["./tsconfig.json"]
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-import-helpers', 'prettier'],
  rules: {
    "@typescript-eslint/restrict-template-expressions": 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-throw-literal': "off",
    '@typescript-eslint/no-misused-promises': 'off',
    'camelcase': 'off',
    'import/no-unresolved': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'interface',
        'format': ['PascalCase'],
        'custom': {
          'regex': '^I[A-Z]',
          'match': true
        }
      }
    ],
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'lines-between-class-members': 'off',
    'import/extensions': [
      'error',
      "ignorePackages",
      {
        'ts': 'never',
        'tsx': 'never'
      }
    ],
    'import-helpers/order-imports': [
      'warn',
      {
        'newlinesBetween': 'always',
        'groups': ['module', '/^@/', ['parent', 'sibling', 'index']],
        'alphabetize': {
          'order': 'asc',
          'ignoreCase': true
        }
      }
    ],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        'devDependencies': ['**/*.spec.js', "jest.config.ts"]
      }
    ],
    'prettier/prettier': [
      'error',
      {
        'printWidth': 80,
        'tabWidth': 2,
        'singleQuote': true,
        'trailingComma': 'all',
        'arrowParens': 'always',
        'semi': false,
        'endOfLine': 'auto'
      }
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error']
  },
  settings: {
    'import/resolver': {
      typescript: {}
    },
    'import/parsers': {
      [require.resolve('@typescript-eslint/parser')]: ['.ts', '.tsx', '.d.ts'],
    },
  }
}
