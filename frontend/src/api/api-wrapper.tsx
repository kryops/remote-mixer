import { ApiInMessage } from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'
import { JSX, useEffect, useState } from 'react'

import { LoadingScreen } from '../ui/main/loading-screen'

import { handleApiMessage } from './state'

let socket: WebSocket | undefined
/** The last time a heartbeat was received from the server. */
let lastHeartBeat: number | undefined

export function sendApiMessage(message: ApiInMessage) {
  logger.trace('Sending WebSocket message', message)
  if (!socket || socket.readyState !== socket.OPEN) return
  socket.send(JSON.stringify(message))

  // we keep the UI more responsive by applying the new state straight away
  // instead of waiting for the response
  if (message.type !== 'sync-device') handleApiMessage(message)
}

export function ApiWrapper({ children }: { children: JSX.Element }) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    function connectWebSocket() {
      socket = new WebSocket(`ws://${self.location.host}/websocket`)

      socket.onopen = () => {
        logger.info('WebSocket connection established')
      }

      socket.onmessage = event => {
        try {
          const message = JSON.parse(event.data)
          logger.trace('WebSocket message', message)
          handleApiMessage(message)
          if (message.type === 'sync') setConnected(true)
          if (message.type === 'heartbeat') {
            lastHeartBeat = Date.now()
          }
        } catch (e) {
          logger.error(
            'WebSocket message parse error',
            e,
            'message was:',
            event.data
          )
        }
      }

      socket.onclose = handleClose

      socket.onerror = e => logger.error('WebSocket error', e)
    }

    function handleClose() {
      logger.warn('WebSocket connection was closed, reconnecting...')
      setConnected(false)
      socket = undefined
      lastHeartBeat = undefined
      setTimeout(connectWebSocket, 1000)
    }

    if (!socket || socket.readyState !== socket.OPEN) connectWebSocket()

    const interval = setInterval(() => {
      if (!lastHeartBeat || Date.now() - lastHeartBeat < 5000) return

      logger.error('No heartbeat received, reconnecting...')
      handleClose()
    }, 2000)

    return () => {
      if (socket) {
        socket.close()
        socket = undefined
      }
      clearInterval(interval)
    }
  }, [])

  if (!connected) {
    return <LoadingScreen />
  }

  return children
}
