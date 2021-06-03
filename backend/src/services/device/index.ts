import {
  ApiChangeMessage,
  ApiMetersMessage,
  DeviceConfiguration,
} from '@remote-mixer/types'

import { broadcastToSockets } from '../http/websocket'
import { applyStateFromMessage } from '../state'

export const deviceConfiguration: DeviceConfiguration = {
  categories: [
    {
      key: 'ch',
      label: 'Channels',
      count: 32,
      meters: true,
      faderProperties: [
        'aux1',
        'aux2',
        'aux3',
        'aux4',
        'aux5',
        'aux6',
        'aux7',
        'aux8',
        'bus1',
        'bus2',
        'bus3',
        'bus4',
        'bus5',
        'bus6',
        'bus7',
        'bus8',
      ],
    },
    {
      key: 'aux',
      label: 'AUX',
      count: 8,
      namePrefix: 'AUX',
    },
    {
      key: 'bus',
      label: 'BUS',
      count: 8,
      namePrefix: 'BUS',
    },
    {
      key: 'sum',
      label: 'Master',
      count: 1,
      namePrefix: 'SUM',
    },
  ],
}

// TODO dummy

setInterval(() => {
  const message: ApiMetersMessage = {
    type: 'meters',
    meters: {},
  }
  for (let i = 1; i <= 32; i++) {
    message.meters['ch' + i] = Math.round(Math.random() * 255)
  }

  applyStateFromMessage(message)
  broadcastToSockets(message)
}, 200)

setInterval(() => {
  const message: ApiChangeMessage = {
    type: 'change',
    category: 'ch',
    id: String(1 + Math.round(Math.random() * 31)),
    property: 'value',
    value: Math.round(Math.random() * 255),
  }

  applyStateFromMessage(message)
  broadcastToSockets(message)
}, 200)
