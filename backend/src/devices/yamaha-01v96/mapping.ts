import { DeviceMessage } from '@remote-mixer/types'

import {
  channelAux2Offset,
  data2Fader,
  data2On,
  fader2Data,
  offset2ChannelAux,
  on2Data,
} from './converters'
import { MidiMessage, MidiMessageArgs } from './message'
import { changeName, handleNameMessage, isNameMessage } from './names'
import { sync } from './sync'

const defaultDataType = 0x01
const defaultParameter = 0x00

const channelAuxFaderElement = 0x23
export const channelAuxRange = 3
const channelAuxSendOffset = 2

interface SimpleMapping {
  category: string
  property: string
  deviceSpecific?: boolean
  element: number
  dataType?: number
  parameter?: number
}

const simpleMapping: SimpleMapping[] = [
  {
    category: 'ch',
    property: 'value',
    element: 0x1c,
  },
  {
    category: 'ch',
    property: 'on',
    element: 0x1a,
  },
  {
    category: 'aux',
    property: 'value',
    element: 0x39,
  },
  {
    category: 'aux',
    property: 'on',
    element: 0x36,
  },
  {
    category: 'bus',
    property: 'value',
    element: 0x2b,
  },
  {
    category: 'bus',
    property: 'on',
    element: 0x29,
  },
  {
    category: 'sum',
    property: 'value',
    element: 0x4f,
  },
  {
    category: 'sum',
    property: 'on',
    element: 0x4d,
  },
]

interface MessageMapping {
  incoming(message: MidiMessage): DeviceMessage | null
  outgoing?(
    category: string,
    id: string,
    property: string,
    value?: unknown
  ): MidiMessageArgs | null
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const messageMapping: MessageMapping[] = [
  // simple mapping
  // - faders
  // - on buttons
  {
    incoming: message => {
      if (!message.data) return null
      const matchingMapping = simpleMapping.find(
        entry =>
          message.deviceSpecific === (entry.deviceSpecific ?? false) &&
          message.dataType === (entry.dataType ?? defaultDataType) &&
          message.element === entry.element &&
          message.parameter === (entry.parameter ?? defaultParameter)
      )
      if (!matchingMapping) return null

      return {
        type: 'change',
        category: matchingMapping.category,
        id: String(message.channel + 1),
        property: matchingMapping.property,
        value:
          matchingMapping.property === 'on'
            ? data2On(message.data)
            : data2Fader(message.data),
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
        message.element !== channelAuxFaderElement ||
        message.parameter % channelAuxRange !== channelAuxSendOffset ||
        !message.data
      ) {
        return null
      }

      return {
        type: 'change',
        category: 'ch',
        id: String(message.channel + 1),
        property: 'aux' + offset2ChannelAux(message.parameter),
        value: data2Fader(message.data),
      }
    },

    outgoing: (category, id, property, value) => {
      if (category !== 'ch' || !property.startsWith('aux')) return null
      const aux = parseInt(property.slice(3))
      return {
        channel: parseInt(id) - 1,
        dataType: 0x01,
        element: channelAuxFaderElement,
        parameter: channelAux2Offset(aux) + channelAuxSendOffset,
        data: value !== undefined ? fader2Data(value) : undefined,
      }
    },
  },

  // meters
  {
    incoming: message => {
      if (!message.deviceSpecific || message.dataType !== 0x21 || !message.data)
        return null
      // echo messages from meter requests are accidentally
      // recognized as meter messages
      if (message.raw.length < 71) return null

      const outMessage: DeviceMessage = {
        type: 'meters',
        meters: {},
      }

      for (let channel = 1; channel <= 32; channel++) {
        outMessage.meters[`ch${channel}`] = message.data[2 * (channel - 1)]
      }

      return outMessage
    },
  },

  // names
  {
    incoming: message => {
      return isNameMessage(message) ? handleNameMessage(message) : null
    },

    outgoing: (category, id, property, value) => {
      if (property !== 'name') return null
      changeName(category, id, value as string)

      // Changing the name usually requires multiple messages, which the handler
      // does internally
      return null
    },
  },

  // program change -> sync
  {
    incoming: message => {
      if (message.dataType === 0x10) {
        sync()
      }
      return null
    },
  },
]
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
