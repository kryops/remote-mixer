import { DeviceMessage } from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'

import { formatMessage, isMessage, message, parseMessage } from './message'
import { messageMapping } from './mapping'

export function interpretIncomingMessage(
  message: number[]
): DeviceMessage | true | null {
  if (!isMessage(message)) {
    logger.warn('Invalid MIDI message', formatMessage(message))
    return null
  }

  const midiMessage = parseMessage(message)

  for (const mapping of messageMapping) {
    const result = mapping.incoming(midiMessage)
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
  for (const mapping of messageMapping) {
    const result = mapping.outgoing?.(category, id, property, value)
    if (result && typeof result === 'object') return message(result)
    if (result) break
  }

  return null
}

export function getRequestMessage(
  category: string,
  id: string,
  property: string
): number[] | null {
  for (const mapping of messageMapping) {
    const result = mapping.outgoing?.(category, id, property)
    if (result && typeof result === 'object')
      return message({ ...result, isRequest: true })
    if (result) break
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
