import { DeviceMessage } from '@remote-mixer/types'
import { OSC } from 'osc'

import { messageMapping } from './mapping'

export function interpretIncomingMessage(
  message: OSC.Message
): DeviceMessage | true | null {
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
): OSC.Message | null {
  for (const { outgoing } of messageMapping) {
    const result = outgoing?.(category, id, property, value)
    if (result && typeof result === 'object') return result
    if (result) break
  }

  return null
}

export function getRequestMessage(
  category: string,
  id: string,
  property: string
): OSC.Message | null {
  for (const { outgoing } of messageMapping) {
    const result = outgoing?.(category, id, property)
    if (result && typeof result === 'object') return result
    if (result) break
  }

  return null
}

export function getMeterRequest(): OSC.Message {
  return {
    address: '/meters',
    args: [
      '/meters/13',
      { type: 'i', value: 2 }, // time factor = 100ms
    ],
  }
}
