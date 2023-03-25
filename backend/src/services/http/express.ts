import { createServer } from 'http'
import { join } from 'path'

import compression from 'compression'
import express, { type Express } from 'express'

export const expressApp: Express = express()
export const httpServer = createServer(expressApp)

export async function initExpressApp(): Promise<void> {
  expressApp.use(compression())
  expressApp.use(express.static(join(__dirname, '../../../../frontend/dist')))
}
