const isTest = process.env.NODE_ENV === 'test'
const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isTest ? 'commonjs' : false,
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      ['@babel/preset-typescript', { onlyRemoveTypeImports: false }],
    ],
    plugins: [
      'babel-plugin-react-compiler', // must run first!
      [
        'babel-plugin-polyfill-corejs3',
        {
          method: 'entry-global',
          version: '3.51',
        },
      ],
      '@babel/plugin-transform-runtime',
    ].filter(Boolean),
  }
}
