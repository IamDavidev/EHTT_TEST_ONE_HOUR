module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    'react'
  ],
  rules: {
    'no-use-before-define': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      'warn', {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    ]
  }
}
