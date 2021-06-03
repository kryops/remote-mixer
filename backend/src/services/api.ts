import { ApiInMessage, ApiSyncMessage } from '@remote-mixer/types'

import { deviceConfiguration } from './device'
import { broadcastToSockets } from './http/websocket'
import { applyStateFromMessage, getState } from './state'

export function handleApiMessage(message: ApiInMessage): void {
  applyStateFromMessage(message)
  broadcastToSockets(message)
}

export function getSyncMessage(): ApiSyncMessage {
  return {
    type: 'sync',
    state: getState(),
    device: deviceConfiguration,
  }
}
