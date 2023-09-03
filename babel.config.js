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
          useBuiltIns: 'entry',
          corejs: '3.21',
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      '@babel/preset-typescript',
      '@linaria',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          useESModules: !isTest,
        },
      ],

      // optimization
      '@babel/plugin-transform-react-constant-elements',
    ].filter(Boolean),
  }
}
