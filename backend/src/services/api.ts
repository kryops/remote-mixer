import { ApiInMessage, ApiSyncMessage } from '@remote-mixer/types'

import { deviceController } from './device'
import { broadcastToSockets } from './http/websocket'
import { applyStateFromMessage, getState } from './state'

export function handleApiMessage(message: ApiInMessage): void {
  applyStateFromMessage(message)

  if (message.type === 'change') {
    const { category, id, property, value } = message
    deviceController.change(category, id, property, value)
  }

  broadcastToSockets(message)
}

export function getSyncMessage(): ApiSyncMessage {
  return {
    type: 'sync',
    state: getState(),
    device: deviceController.deviceConfig,
  }
}
