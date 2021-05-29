module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      { patterns: ['**/shared/src/**', '@mdi/js'] },
    ],
    'import/no-nodejs-modules': 'error',
  },
}
