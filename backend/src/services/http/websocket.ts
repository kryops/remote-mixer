import { ApiOutMessage } from '@remote-mixer/types'
import ws from 'ws'
import { removeFromMutableArray, logger } from '@remote-mixer/utils'

import {
  getApiHeartBeatMessage,
  getSyncMessage,
  handleApiMessage,
  isApiInMessage,
} from '../api'

import { httpServer } from './express'

export const sockets: ws[] = []

function removeSocket(socket: ws) {
  logger.info('Socket disconnected')
  removeFromMutableArray(sockets, socket)
}

function sendSocketMessage(socket: ws, message: ApiOutMessage) {
  const messageString = JSON.stringify(message)
  socket.send(messageString)
}

export async function initWebSocketServer(): Promise<void> {
  const wsServer = new ws.Server({ server: httpServer, path: '/websocket' })
  wsServer.on('connection', socket => {
    logger.info('Socket connected')
    sockets.push(socket)
    socket.on('message', (message: Buffer) => {
      logger.trace('incoming message:', message)
      let parsed: unknown
      try {
        parsed = JSON.parse(message.toString())
      } catch {
        logger.warn('Ignoring unparsable WebSocket message')
        return
      }
      if (!isApiInMessage(parsed)) {
        logger.warn('Ignoring invalid WebSocket message', parsed)
        return
      }
      handleApiMessage(parsed, socket)
    })

    socket.on('close', () => removeSocket(socket))
    socket.on('error', () => removeSocket(socket))

    sendSocketMessage(socket, getSyncMessage())
  })

  setInterval(() => {
    broadcastToSockets(getApiHeartBeatMessage())
  }, 2000)
}

export function broadcastToSockets(message: ApiOutMessage, exclude?: ws): void {
  if (!sockets.length) {
    return
  }
  logger.trace('broadcast WebSocket message', message)
  const messageString = JSON.stringify(message)
  sockets.forEach(socket => {
    if (exclude !== socket) socket.send(messageString)
  })
}
