module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    jest: true,
    node: true,
    "jest/globals": true
	"cypress/globals": true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],

  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  "plugins": [
	"react", "jest", "cypress"
  ],
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'jest'],
  rules: {
    "no-unused-vars": 0,
    "react/react-in-jsx-scope": "off"
  },
}