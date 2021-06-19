import { DeviceMessage } from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'

import {
  channelAux2Offset,
  data2Fader,
  data2On,
  DataBytes,
  fader2Data,
  isDataBytes,
  offset2ChannelAux,
  on2Data,
} from './converters'
import { MessageArgs, sync } from './protocol'
import { formatMessage } from './utils'

const defaultDataType = 0x01
const defaultParameter = 0x01

const elements = {
  channelFader: 0x1c,
  channelOn: 0x1a,
  channelAuxFader: 0x23,

  auxFader: 0x39,
  auxOn: 0x36,

  busFader: 0x2b,
  busOn: 0x41,

  sumFader: 0x4f,
  sumOn: 0x4d,
}

export const channelAuxRange = 3
const channelAuxSendOffset = 2

interface SimpleMapping {
  category: string
  property: string
  element: number
  dataType?: number
  parameter?: number
}

const simpleMapping: SimpleMapping[] = [
  {
    category: 'ch',
    property: 'value',
    element: elements.channelFader,
  },
  {
    category: 'ch',
    property: 'on',
    element: elements.channelOn,
  },
  {
    category: 'aux',
    property: 'value',
    element: elements.auxFader,
  },
  {
    category: 'aux',
    property: 'on',
    element: elements.auxOn,
  },
  {
    category: 'bus',
    property: 'value',
    element: elements.busFader,
  },
  {
    category: 'bus',
    property: 'on',
    element: elements.busOn,
  },
  {
    category: 'sum',
    property: 'value',
    element: elements.sumFader,
  },
  {
    category: 'sum',
    property: 'on',
    element: elements.sumOn,
  },
]

function extractData(message: number[]): DataBytes | null {
  const data = message.slice(9, -1)
  if (!isDataBytes(data)) {
    logger.warn('Invalid MIDI message (data too short)', formatMessage(message))
    return null
  }
  return data
}

interface MessageMapping {
  incoming(message: number[]): DeviceMessage | null
  outgoing?(
    category: string,
    id: string,
    property: string,
    value?: unknown
  ): MessageArgs | null
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const messageMapping: MessageMapping[] = [
  // simple mapping
  // - faders
  // - on buttons
  {
    incoming: message => {
      const matchingMapping = simpleMapping.find(
        entry =>
          message[5] === (entry.dataType ?? defaultDataType) &&
          entry.element === message[6] &&
          message[7] === (entry.parameter ?? defaultParameter)
      )
      if (!matchingMapping) return null

      const data = extractData(message)
      if (!data) return null

      return {
        type: 'change',
        category: matchingMapping.category,
        id: String(message[8] + 1),
        property: matchingMapping.property,
        value:
          matchingMapping.property === 'on' ? data2On(data) : data2Fader(data),
      }
    },

    outgoing: (category, id, property, value) => {
      const matchingMapping = simpleMapping.find(
        entry => entry.category === category && entry.property === property
      )
      if (!matchingMapping) return null

      return {
        channel: parseInt(id) - 1,
        dataType: matchingMapping.dataType ?? defaultDataType,
        element: matchingMapping.element,
        parameter: matchingMapping.parameter ?? defaultParameter,
        data:
          value !== undefined
            ? property === 'on'
              ? on2Data(value)
              : fader2Data(value)
            : undefined,
      }
    },
  },

  // AUX send
  {
    incoming: message => {
      if (
        message[6] !== elements.channelAuxFader ||
        message[7] % channelAuxRange !== channelAuxSendOffset
      ) {
        return null
      }

      const data = extractData(message)
      if (!data) return null

      return {
        type: 'change',
        category: 'ch',
        id: String(message[8] + 1),
        property: 'aux' + offset2ChannelAux(message[6]),
        value: data2Fader(data),
      }
    },

    outgoing: (category, id, property, value) => {
      if (category !== 'ch' || !property.startsWith('aux')) return null
      const aux = parseInt(property.slice(3))
      return {
        channel: parseInt(id) - 1,
        dataType: 0x01,
        element: elements.channelAuxFader,
        parameter: channelAux2Offset(aux) + channelAuxSendOffset,
        data: value !== undefined ? fader2Data(value) : undefined,
      }
    },
  },

  // meters
  {
    incoming: message => {
      if (message[5] !== 0x21) return null
      // echo messages from meter requests are accidentally
      // recognized as meter messages
      if (message.length < 71) return null

      const outMessage: DeviceMessage = {
        type: 'meters',
        meters: {},
      }

      for (let channel = 1; channel <= 32; channel++) {
        outMessage.meters[`ch${channel}`] = message[9 + 2 * (channel - 1)]
      }

      return outMessage
    },
  },

  // program change -> sync
  {
    incoming: message => {
      if (message[5] === 0x10) {
        sync()
      }
      return null
    },
  },
]
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
