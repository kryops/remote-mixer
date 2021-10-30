import { DeviceController, DeviceMessageListener } from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'

import { connect, sendMessage } from './connection'
import { deviceConfig } from './device-config'
import { changeName } from './names'
import {
  getChangeMessage,
  getMeterReqest,
  interpretIncomingMessage,
} from './protocol'
import { sync } from './sync'
import { formatMessage } from './message'
import { refreshDependentChannels } from './pairs-groups'

// The 01v96 sends its meters 20 times a second, we only want to use half of them
let skipNextMeterMessage = false

export default class Yamaha01v96DeviceController implements DeviceController {
  deviceConfig = deviceConfig

  constructor(private listener: DeviceMessageListener) {
    connect(message => {
      const internalMessage = interpretIncomingMessage(message)
      if (internalMessage && typeof internalMessage === 'object') {
        if (internalMessage.type === 'meters') {
          skipNextMeterMessage = !skipNextMeterMessage
          if (!skipNextMeterMessage) this.listener(internalMessage)
        } else {
          this.listener(internalMessage)
        }
      }

      if (message === null) {
        logger.debug('<== unhandled message', formatMessage(message))
      }
    })

    sync()

    setInterval(() => {
      sendMessage(getMeterReqest())
    }, 10000)
  }

  change(category: string, id: string, property: string, value: unknown): void {
    if (property === 'name') {
      changeName(category, id, value as string)
      return
    }

    const message = getChangeMessage(category, id, property, value)
    logger.debug(
      `==> change ${category} ${id} ${property} ${value} =>`,
      formatMessage(message)
    )
    if (message) sendMessage(message)

    if (category === 'ch' && (property === 'value' || property === 'on')) {
      refreshDependentChannels(id, property)
    }
  }

  sync(): void {
    logger.debug('==> synchronizing...')
    sync()
  }
}
