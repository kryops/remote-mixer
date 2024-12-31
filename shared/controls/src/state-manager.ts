import {
  ApiInMessage,
  ApiOutMessage,
  DeviceMessage,
  RemoteMixerState,
} from '@remote-mixer/types'
import { assertNever } from '@remote-mixer/utils'

export class StateManager {
  state: RemoteMixerState = {
    categories: {},
    meters: {},
  }

  handleMessage(
    message: ApiInMessage | ApiOutMessage | DeviceMessage
  ): boolean {
    switch (message.type) {
      case 'sync':
        this.state = message.state
        break

      case 'meters':
        Object.assign(this.state.meters, message.meters)
        break

      case 'change': {
        const { category, id, property, value } = message

        const categoryEntry = this.state.categories[category]

        if (categoryEntry?.[id]?.[property] === value) return false

        if (!categoryEntry) {
          this.state.categories[category] = { [id]: { [property]: value } }
        } else if (!categoryEntry[id]) {
          this.state.categories[category][id] = { [property]: value }
        } else {
          this.state.categories[category][id][property] = value
        }
        break
      }
      case 'sync-device':
      case 'heartbeat':
        // do nothing
        break

      default:
        assertNever(message)
    }

    return true
  }
}
