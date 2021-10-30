import { delay } from '../../util/time'

import { sendMessage } from './connection'
import { deviceConfig } from './device-config'
import { getRequestMessage } from './protocol'

export async function sync(): Promise<void> {
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
        if (message) sendMessage(message)
      }

      // If we don't wait, some messages will get lost and the sync will be incomplete
      await delay(20)
    }
  }
}
