module.exports = {
  extends: ['plugin:node/recommended-module'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
    'no-process-exit': 'off',
    'node/no-missing-import': 'off',
    'node/no-unpublished-import': 'off',
  },
}
