const startTime = Date.now()

import sourceMapSupport from 'source-map-support'
import { setLogLevel, logger } from '@remote-mixer/utils'

import { httpServer } from './services/http/express'
import { httpPort, logLevel } from './services/config'
import { isDevelopment } from './services/env'
import { initHttpServer } from './services/http'

sourceMapSupport.install()

// we want to keep the process running under all circumstances

process.on('uncaughtException', err => {
  logger.error('UNCAUGHT EXCEPTION', err)
})

process.on('unhandledRejection', err => {
  logger.error('UNHANDLED REJECTION', err)
})

// ...except for when we actually want to kill it

if (!isDevelopment) {
  process.on('SIGINT', () => {
    logger.warn('SIGINT received, exiting...')
    process.exit()
  })
}

setLogLevel(logLevel)

// actual initialization

async function init() {
  await Promise.all([initHttpServer()])

  await new Promise<void>(resolve => httpServer.listen(httpPort, resolve))

  const startDuration = (Date.now() - startTime) / 1000
  logger.info(
    `remote-mixer started on http://127.0.0.1:${httpPort} (took ${startDuration}s)`
  )
}

init()
