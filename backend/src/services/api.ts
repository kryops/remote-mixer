import {
  ApiHeartBeatMessage,
  ApiInMessage,
  ApiSyncMessage,
} from '@remote-mixer/types'
import { assertNever } from '@remote-mixer/utils'
import ws from 'ws'

import { mode } from './config'
import { deviceController } from './device'
import { broadcastToSockets } from './http/websocket'
import { applyStateFromMessage, getState } from './state'

/** Validates untrusted client input before it reaches the state. */
export function isApiInMessage(message: unknown): message is ApiInMessage {
  if (typeof message !== 'object' || message === null) return false
  const { type, category, id, property } = message as Record<string, unknown>

  switch (type) {
    case 'change':
      return (
        typeof category === 'string' &&
        typeof id === 'string' &&
        typeof property === 'string'
      )
    case 'sync-device':
      return true
    default:
      return false
  }
}

export function handleApiMessage(message: ApiInMessage, source: ws): void {
  if (!applyStateFromMessage(message)) return

  switch (message.type) {
    case 'change': {
      const { category, id, property, value } = message
      deviceController.change(category, id, property, value)
      broadcastToSockets(message, source)
      break
    }
    case 'sync-device':
      deviceController.sync?.()
      break

    default:
      assertNever(message)
  }
}

export function getSyncMessage(): ApiSyncMessage {
  return {
    type: 'sync',
    state: getState(),
    device: deviceController.deviceConfig,
    mode,
  }
}

export function getApiHeartBeatMessage(): ApiHeartBeatMessage {
  return { type: 'heartbeat' }
}
