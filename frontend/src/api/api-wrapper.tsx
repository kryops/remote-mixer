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
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined

    /** Detaches all handlers so the old socket cannot trigger reconnects. */
    function disposeSocket() {
      if (!socket) return
      socket.onopen = null
      socket.onmessage = null
      socket.onclose = null
      socket.onerror = null
      socket.close()
      socket = undefined
    }

    function connectWebSocket() {
      reconnectTimeout = undefined
      disposeSocket()
      socket = new WebSocket(`ws://${self.location.host}/websocket`)
      // start the timeout right away, so a connection that hangs before
      // delivering its first heartbeat still fails over
      lastHeartBeat = Date.now()

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
      disposeSocket()
      lastHeartBeat = undefined
      if (reconnectTimeout === undefined) {
        reconnectTimeout = setTimeout(connectWebSocket, 1000)
      }
    }

    connectWebSocket()

    const interval = setInterval(() => {
      if (!lastHeartBeat || Date.now() - lastHeartBeat < 5000) return

      logger.error('No heartbeat received, reconnecting...')
      handleClose()
    }, 2000)

    return () => {
      disposeSocket()
      if (reconnectTimeout !== undefined) clearTimeout(reconnectTimeout)
      clearInterval(interval)
    }
  }, [])

  if (!connected) {
    return <LoadingScreen />
  }

  return children
}
