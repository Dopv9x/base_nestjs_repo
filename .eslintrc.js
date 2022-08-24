module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:prettier/recommended', 'prettier'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': ['warn'],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: ['class', 'interface', 'enum'],
        format: ['PascalCase'],
      },
    ],
    'lines-between-class-members': ['error', 'always'],
  },
};
