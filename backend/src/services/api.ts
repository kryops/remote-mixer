import ws from 'ws'
import { ApiInMessage, ApiSyncMessage } from '@remote-mixer/types'
import { assertNever } from '@remote-mixer/utils'

import { deviceController } from './device'
import { broadcastToSockets } from './http/websocket'
import { applyStateFromMessage, getState } from './state'

export function handleApiMessage(message: ApiInMessage, source: ws): void {
  if (!applyStateFromMessage(message)) return

  switch (message.type) {
    case 'change':
      const { category, id, property, value } = message
      deviceController.change(category, id, property, value)
      broadcastToSockets(message, source)
      break

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
  }
}
