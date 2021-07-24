import { logger } from '@remote-mixer/utils'

import { formatMessage } from './utils'

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

const sysexStart = 0xf0
const sysexEnd = 0xf7
const manufacturer = 0x43
const groupId = 0x3e

const subStatus = {
  parameterChange: 0x10, // 0001nnnn 1n n=0-15 (Device number=MIDI Channel)
  parameterRequest: 0x30, // 0011nnnn 3n n=0-15 (Device number=MIDI Channel)
}

const modelId = {
  deviceSpecific: 0x0d, // 01v96i: 0x1a
  universal: 0x7f,
}

export type DataBytes = [number, number, number, number, ...number[]]

export function isDataBytes(data: number[]): data is DataBytes {
  return data.length >= 4
}

export interface MidiMessage {
  isRequest: boolean
  dataType: number
  element: number
  parameter: number
  channel: number
  data?: DataBytes
  deviceSpecific: boolean
  raw: number[]
}

export interface MidiMessageArgs
  extends Omit<MidiMessage, 'raw' | 'isRequest' | 'data' | 'deviceSpecific'> {
  isRequest?: boolean
  data?: number[]
  deviceSpecific?: boolean
}

export function message({
  isRequest,
  dataType,
  element,
  parameter,
  channel,
  data,
  deviceSpecific,
}: MidiMessageArgs): number[] {
  return [
    sysexStart,
    manufacturer,
    isRequest ? subStatus.parameterRequest : subStatus.parameterChange,
    groupId,
    deviceSpecific ? modelId.deviceSpecific : modelId.universal,
    dataType,
    element,
    parameter,
    channel,
    ...(data ?? []),
    sysexEnd,
  ]
}

export function extractData(message: number[]): DataBytes | null {
  const data = message.slice(9, -1)
  if (!isDataBytes(data)) {
    logger.warn('Invalid MIDI message (data too short)', formatMessage(message))
    return null
  }
  return data
}

export function isMessage(message: number[]): boolean {
  return (
    message.length >= 10 &&
    message[0] === sysexStart &&
    message[1] === manufacturer &&
    message[2] === subStatus.parameterChange &&
    message[3] === groupId &&
    (message[4] === modelId.universal ||
      message[4] === modelId.deviceSpecific) &&
    message[message.length - 1] === sysexEnd
  )
}

export function parseMessage(message: number[]): MidiMessage {
  return {
    isRequest: message[2] === subStatus.parameterRequest,
    deviceSpecific: message[4] === modelId.deviceSpecific,
    dataType: message[5],
    element: message[6],
    parameter: message[7],
    channel: message[8],
    data: extractData(message) ?? undefined,
    raw: message,
  }
}
