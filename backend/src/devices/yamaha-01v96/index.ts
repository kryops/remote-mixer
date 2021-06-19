import { DeviceController, DeviceMessageListener } from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'

import { connect, sendMessage } from './connection'
import { deviceConfig } from './device-config'
import {
  getChangeMessage,
  getMeterReqest,
  interpretIncomingMessage,
  sync,
} from './protocol'
import { formatMessage } from './utils'

export default class Yamaha01v96DeviceController implements DeviceController {
  deviceConfig = deviceConfig

  constructor(private listener: DeviceMessageListener) {
    connect(message => {
      // TODO handle long MIDI messages? (>1024 bytes)
      const internalMessage = interpretIncomingMessage(message)
      logger.trace(
        'Incoming MIDI message',
        formatMessage(message),
        '=>',
        internalMessage
      )
      if (internalMessage) this.listener(internalMessage)
    })

    sync()

    sendMessage(getMeterReqest())

    setInterval(() => {
      sendMessage(getMeterReqest())
    }, 10000)
  }

  change(category: string, id: string, property: string, value: unknown): void {
    const message = getChangeMessage(category, id, property, value)
    if (message) sendMessage(message)
  }
}
