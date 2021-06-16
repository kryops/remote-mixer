import { DeviceController, DeviceMessageListener } from '@remote-mixer/types'

import { connect, sendMessage } from './connection'
import { deviceConfig } from './device-config'
import { getChangeMessage, interpretIncomingMessage } from './protocol'

export default class Yamaha01v96DeviceController implements DeviceController {
  deviceConfig = deviceConfig

  constructor(private listener: DeviceMessageListener) {
    connect(message => {
      // TODO handle long MIDI messages
      const internalMessage = interpretIncomingMessage(message)
      if (internalMessage) this.listener(internalMessage)
    })

    // TODO initial sync
    // TODO meter request interval
  }

  change(category: string, id: string, property: string, value: unknown): void {
    const message = getChangeMessage(category, id, property, value)
    if (message) sendMessage(message)
  }
}
