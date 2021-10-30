import { delay } from '../../util/time'

import { sendMessage } from './connection'
import { deviceConfig } from './device-config'
import { requestName } from './names'
import { syncPairsAndGroups } from './pairs-groups'
import { getRequestMessage } from './protocol'

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
        if (message) sendMessage(message)
      }

      // if we send all messages synchronously, we only get a part of them back
      await delay(20)

      requestName(category.key, String(id))

      await delay(20)
    }
  }

  await syncPairsAndGroups()
}
