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
import { logger } from '@remote-mixer/utils'

import { delay } from '../../util/time'

import { sendMessage } from './connection'
import { deviceConfig } from './device-config'
import { messageMapping } from './mapping'
import { formatMessage } from './utils'

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

export interface MessageArgs {
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
    channel,
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
    message[3] === groupId &&
    (message[4] === modelId.universal ||
      message[4] === modelId.deviceSpecific) &&
    message[message.length - 1] === sysexEnd
  )
}

export function interpretIncomingMessage(
  message: number[]
): DeviceMessage | null {
  if (!isMessage(message)) {
    logger.warn('Invalid MIDI message', formatMessage(message))
    return null
  }

  for (const { incoming } of messageMapping) {
    const result = incoming(message)
    if (result) return result
  }

  return null
}

export function getChangeMessage(
  category: string,
  id: string,
  property: string,
  value: unknown
): number[] | null {
  for (const { outgoing } of messageMapping) {
    const result = outgoing?.(category, id, property, value)
    if (result) return message(result)
  }

  return null
}

export function getRequestMessage(
  category: string,
  id: string,
  property: string
): number[] | null {
  for (const { outgoing } of messageMapping) {
    const result = outgoing?.(category, id, property)
    if (result) return message({ ...result, isRequest: true })
  }

  return null
}

export async function sync(): Promise<void> {
  for (const category of deviceConfig.categories) {
    for (let id = 1; id <= category.count; id++) {
      const properties = [
        ...(category.faderProperties?.map(property => property.key) ?? []),
        ...(category.additionalProperties ?? []),
      ]

      if (!properties.includes('value')) properties.push('value')

      for (const property of properties) {
        const message = getRequestMessage(category.key, String(id), property)
        logger.trace(
          '==>',
          `request ${category.key} ${id} ${property} =>`,
          formatMessage(message)
        )
        if (message) sendMessage(message)
      }
      // if we send all messages synchronously, we only get a part of them back
      await delay(20)
    }
  }
}

export function getMeterReqest(): number[] {
  return message({
    isRequest: true,
    deviceSpecific: true,
    dataType: 0x21,
    element: 0x00,
    parameter: 0x00,
    channel: 0x00,
    data: [0, 0x1f], // channel 1-32
  })
}
