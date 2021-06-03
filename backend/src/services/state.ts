import { StateManager } from '@remote-mixer/controls'
import {
  ApiInMessage,
  ApiOutMessage,
  RemoteMixerState,
} from '@remote-mixer/types'

const stateManager = new StateManager()

export function getState(): RemoteMixerState {
  return stateManager.state
}

export function applyStateFromMessage(
  message: ApiInMessage | ApiOutMessage
): void {
  stateManager.handleMessage(message)
}
