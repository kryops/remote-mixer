import { DeviceControllerConstructor } from '@remote-mixer/types'

import { device } from './config'
import { broadcastToSockets } from './http/websocket'
import { applyStateFromMessage } from './state'

const deviceName = typeof device === 'object' ? device.type : device

// eslint-disable-next-line @typescript-eslint/no-require-imports
const DeviceController: DeviceControllerConstructor = require(
  '../devices/' + deviceName
).default

export const deviceController = new DeviceController(
  deviceMessage => {
    if (applyStateFromMessage(deviceMessage)) {
      broadcastToSockets(deviceMessage)
    }
  },
  typeof device === 'object' ? device.options : undefined
)
