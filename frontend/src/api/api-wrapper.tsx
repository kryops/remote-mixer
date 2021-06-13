import { ApiInMessage } from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'
import { useEffect, useState } from 'react'

import { LoadingScreen } from '../ui/main/loading-screen'

import { handleApiMessage } from './state'

let socket: WebSocket | undefined

export function sendApiMessage(message: ApiInMessage) {
  logger.trace('Sending WebSocket message', message)
  if (!socket || socket.readyState !== socket.OPEN) return
  socket.send(JSON.stringify(message))

  // we keep the UI more responsive by applying the new state straight away
  // instead of waiting for the response
  handleApiMessage(message)
}

export function ApiWrapper({ children }: { children: JSX.Element }) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    function connectWebSocket() {
      socket = new WebSocket(`ws://${self.location.host}/ws`)

      socket.onopen = () => {
        logger.info('WebSocket connection established')
      }

      socket.onmessage = event => {
        try {
          const message = JSON.parse(event.data)
          logger.trace('WebSocket message', message)
          handleApiMessage(message)
          if (message.type === 'sync') setConnected(true)
        } catch (e) {
          logger.error(
            'WebSocket message parse error',
            e,
            'message was:',
            event.data
          )
        }
      }

      socket.onclose = () => {
        logger.warn('WebSocket connection was closed, reconnecting...')
        setConnected(false)
        socket = undefined
        setTimeout(connectWebSocket, 1000)
      }

      socket.onerror = e => logger.error('WebSocket error', e)
    }

    if (!socket || socket.readyState !== socket.OPEN) connectWebSocket()

    return () => {
      if (socket) {
        socket.close()
        socket = undefined
      }
    }
  }, [])

  if (!connected) {
    return <LoadingScreen />
  }

  return children
}
