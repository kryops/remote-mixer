import {
  DeviceChangeMessage,
  DeviceController,
  DeviceMessageListener,
  DeviceMetersMessage,
} from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'

export default class DummyDeviceController implements DeviceController {
  deviceConfig = {
    categories: [
      {
        key: 'ch',
        label: 'Channels',
        count: 32,
        meters: true,
        namePrefix: 'CH',
        faderProperties: [
          { key: 'value', label: 'CH' },
          { key: 'aux1', label: 'AUX1' },
          { key: 'aux2', label: 'AUX2' },
          { key: 'aux3', label: 'AUX3' },
          { key: 'aux4', label: 'AUX4' },
        ],
      },
      {
        key: 'aux',
        label: 'AUX',
        count: 4,
        namePrefix: 'AUX',
      },
      {
        key: 'sum',
        label: 'Master',
        count: 1,
        namePrefix: 'SUM',
      },
    ],
  }

  constructor(private listener: DeviceMessageListener) {
    setInterval(() => {
      const message: DeviceMetersMessage = {
        type: 'meters',
        meters: {},
      }
      for (let i = 1; i <= 32; i++) {
        message.meters['ch' + i] = Math.round(Math.random() * 255)
      }

      this.listener(message)
    }, 1000)

    setInterval(() => {
      const message: DeviceChangeMessage = {
        type: 'change',
        category: 'ch',
        id: String(1 + Math.round(Math.random() * 31)),
        property: 'value',
        value: Math.round(Math.random() * 255),
      }

      this.listener(message)
    }, 1000)
  }

  change(category: string, id: string, property: string, value: string): void {
    logger.debug('[dummy] change', category, id, property, value)
  }
}
