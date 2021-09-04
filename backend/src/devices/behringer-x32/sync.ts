import { OSC, timeTag } from 'osc'

import { sendMessage } from './connection'
import { deviceConfig } from './device-config'
import { getRequestMessage } from './protocol'

export async function sync(): Promise<void> {
  const messages: OSC.Message[] = []

  for (const category of deviceConfig.categories) {
    for (let id = 1; id <= category.count; id++) {
      const properties = [
        ...(category.faderProperties?.map(property => property.key) ?? []),
        ...(category.additionalProperties ?? []),
        'name',
      ]

      if (!properties.includes('value')) properties.push('value')

      for (const property of properties) {
        const message = getRequestMessage(category.key, String(id), property)
        if (message) messages.push(message)
      }
    }
  }

  sendMessage({
    timeTag: timeTag(0),
    packets: messages,
  })
}
