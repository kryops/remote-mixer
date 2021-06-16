/*
 * General message format:
 *
 * [0] F0 sysex start
 * [1] 43 Manufacture’s ID number (YAMAHA)
 * [2] 1n parameter change n=0-15 (Device number=MIDI Channel)
 *     3n parameter request n=0-15 (Device number=MIDI Channel)
 * [3] 3E MODEL ID (digital mixer)
 * [4] 7F Universal
 *     1A device-specific
 * [5] tt Data type
 * [6] ee Element no.
 * [7] pp Parameter no.
 * [8] cc Channel no.
 * [.] dd data
 *     ...
 * [n] F7 sysex end
 */

import { DeviceMessage } from '@remote-mixer/types'

const sysexStart = 0xf0
const sysexEnd = 0xf7
const manufacturer = 0x43
const groupId = 0x3e

const subStatus = {
  parameterChange: 0x10, // 0001nnnn 1n n=0-15 (Device number=MIDI Channel)
  parameterRequest: 0x30, // 0011nnnn 3n n=0-15 (Device number=MIDI Channel)
}

const modelId = {
  deviceSpecific: 0x1a,
  universal: 0x7f,
}

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

const channelAuxRange = 3
const channelAuxOffset = 2

interface Mapping {
  category: string
  property: string
  element: number
  dataType?: number
}

const mapping: Mapping[] = [
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

interface MessageArgs {
  isRequest?: boolean
  dataType: number
  element: number
  parameter: number
  channel: number
  data?: number[]
  deviceSpecific?: boolean
}

function message({
  isRequest,
  dataType,
  element,
  parameter,
  channel,
  data,
  deviceSpecific,
}: MessageArgs): number[] {
  return [
    sysexStart,
    manufacturer,
    isRequest ? subStatus.parameterRequest : subStatus.parameterChange,
    groupId,
    deviceSpecific ? modelId.deviceSpecific : modelId.universal,
    dataType,
    element,
    parameter,
    channel - 1,
    ...(data ?? []),
    sysexEnd,
  ]
}

function isMessage(message: number[]) {
  return (
    message.length >= 10 &&
    message[0] === sysexStart &&
    message[1] === manufacturer &&
    message[2] === subStatus.parameterChange &&
    (message[3] === modelId.universal ||
      message[3] === modelId.deviceSpecific) &&
    message[message.length - 1] === sysexEnd
  )
}

/**
 * 10bit fader values are transmitted in 4 bytes
 * 00000000 00000000 00000nnn 0nnnnnnn
 */
function fader2Data(value: unknown) {
  if (typeof value !== 'number') return [0, 0, 0, 0]
  return [0, 0, value >> 7, value & 0x7f]
}

function data2Fader(data: number[]) {
  return (data[2] << 7) + data[3]
}

/**
 * channel on values: last byte 1/0
 */
function on2Data(on: unknown) {
  return [0, 0, 0, on ? 1 : 0]
}

function data2On(data: number[]) {
  return !!data[3]
}

/**
 * AUX1: 0-2 (2: fader)
 * AUX2: 3-5 (5: fader)
 * ...
 */
function getChannelAuxBinary(aux: number) {
  return (aux - 1) * channelAuxRange + channelAuxOffset
}

function binary2ChannelAux(binary: number) {
  return (binary % 3) + 1
}

export function interpretIncomingMessage(
  message: number[]
): DeviceMessage | null {
  if (!isMessage(message)) return null

  const data = message.slice(9, -1)

  const matchingMapping = mapping.find(
    entry =>
      message[5] === (entry.dataType ?? 0x01) && entry.element === message[6]
  )

  if (matchingMapping) {
    return {
      type: 'change',
      category: matchingMapping.category,
      id: String(message[8] + 1),
      property: matchingMapping.property,
      value:
        matchingMapping.property === 'on' ? data2On(data) : data2Fader(data),
    }
  }

  // Channel AUX sends
  if (
    message[6] === elements.channelAuxFader &&
    message[7] % channelAuxRange === channelAuxOffset
  ) {
    return {
      type: 'change',
      category: 'ch',
      id: String(message[8] + 1),
      property: 'aux' + binary2ChannelAux(message[6]),
      value: data2Fader(data),
    }
  }

  // TODO meters
  // TODO sync after program change

  return null
}

export function getChangeMessage(
  category: string,
  id: string,
  property: string,
  value: unknown
): number[] | null {
  const matchingMapping = mapping.find(
    entry => entry.category === category && entry.property === property
  )

  if (matchingMapping) {
    return message({
      channel: parseInt(id) - 1,
      dataType: 0x01,
      element: matchingMapping.element,
      parameter: 0x00,
      data: property === 'on' ? on2Data(value) : fader2Data(value),
    })
  }

  if (category === 'ch' && property.startsWith('aux')) {
    const aux = parseInt(property.slice(3))
    return message({
      channel: parseInt(id) - 1,
      dataType: 0x01,
      element: elements.channelAuxFader,
      parameter: getChannelAuxBinary(aux) + channelAuxOffset,
      data: fader2Data(value),
    })
  }

  return null
}
