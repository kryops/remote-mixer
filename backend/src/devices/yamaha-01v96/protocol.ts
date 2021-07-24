import { DeviceMessage } from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'

import { isMessage, message, parseMessage } from './message'
import { messageMapping } from './mapping'
import { formatMessage } from './utils'

export function interpretIncomingMessage(
  message: number[]
): DeviceMessage | null {
  if (!isMessage(message)) {
    logger.warn('Invalid MIDI message', formatMessage(message))
    return null
  }

  const midiMessage = parseMessage(message)

  for (const { incoming } of messageMapping) {
    const result = incoming(midiMessage)
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
