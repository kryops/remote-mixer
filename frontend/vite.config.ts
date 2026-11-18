// oxlint-disable-next-line import/no-nodejs-modules
import { join } from 'node:path'

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import wyw from '@wyw-in-js/vite'
import browserslist from 'browserslist'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      // transpile from sources in frontend build
      '@remote-mixer/controls': join(__dirname, '../shared/controls/src'),
      '@remote-mixer/utils': join(__dirname, '../shared/utils/src'),
    },
  },
  define: {
    // needed for emittery dependency
    'process.env.DEBUG': JSON.stringify(false),
  },
  plugins: [
    wyw({
      sourceMap: true,
      // polished is evaluated at build time via a runtime require()
      importOverrides: {
        polished: { unknown: 'allow' },
      },
    }),
    react({ compiler: true }),
    // only adds the core-js polyfills that are used and missing in the
    // browsers listed in .browserslistrc
    legacy({
      renderLegacyChunks: false,
      modernPolyfills: true,
      modernTargets: browserslist(null, { path: __dirname }),
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    port: 8001,
    open: true,
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:8000/',
      '/websocket': { target: 'ws://localhost:8000/', ws: true },
    },
  },
})
