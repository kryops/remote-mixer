import { StateManager } from '@remote-mixer/controls'
import {
  ApiInMessage,
  DeviceMessage,
  RemoteMixerState,
} from '@remote-mixer/types'

const stateManager = new StateManager()

export function getState(): RemoteMixerState {
  return stateManager.state
}

export function applyStateFromMessage(
  message: ApiInMessage | DeviceMessage
): boolean {
  return stateManager.handleMessage(message)
}
