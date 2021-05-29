import { ApiOutMessage } from '@remote-mixer/types'
import ws from 'ws'
import { removeFromMutableArray, logger } from '@remote-mixer/utils'

import { httpServer } from './express'

export const sockets: ws[] = []

function removeSocket(socket: ws) {
  logger.info('Socket disconnected')
  removeFromMutableArray(sockets, socket)
}

export async function initWebSocketServer(): Promise<void> {
  const wsServer = new ws.Server({ server: httpServer, path: '/ws' })
  wsServer.on('connection', socket => {
    logger.info('Socket connected')
    sockets.push(socket)
    socket.on('message', message => {
      logger.debug('incoming message:', message)
      // TODO
    })

    socket.on('close', () => removeSocket(socket))
    socket.on('error', () => removeSocket(socket))
  })
}

export function broadcastToSockets(message: ApiOutMessage): void {
  if (!sockets.length) {
    return
  }
  logger.debug('broadcast WebSocket message', message)
  const messageString = JSON.stringify(message)
  sockets.forEach(socket => socket.send(messageString))
}
