import { DeviceMessage } from '@remote-mixer/types'
import { OSC } from 'osc'

import {
  data2Id,
  DataConverter,
  faderConverter,
  id2Data,
  nameConverter,
  onConverter,
} from './converters'

const categoryByPrefix: { [prefix: string]: string } = {
  '/ch/': 'ch',
  '/bus/': 'bus',
  '/mtx/': 'mtx',
  '/main/st/': 'sum',
}

function simpleMapping(
  suffix: string,
  property: string,
  converter: DataConverter
): MessageMapping {
  return {
    incoming: message => {
      if (!message.address.endsWith(suffix)) return null

      for (const [prefix, category] of Object.entries(categoryByPrefix)) {
        if (message.address.startsWith(prefix)) {
          const id = data2Id(
            message.address.slice(prefix.length, prefix.length + 2)
          )

          const value = converter.incoming(message.args[0])
          return {
            type: 'change',
            category,
            id,
            property,
            value,
          }
        }
      }

      return null
    },
    outgoing: (category, id, p, value) => {
      if (p !== property) return null

      for (const [prefix, c] of Object.entries(categoryByPrefix)) {
        if (c === category) {
          const address = prefix + id2Data(id) + suffix
          return {
            address,
            args: value !== undefined ? [converter.outgoing(value)] : [],
          }
        }
      }

      return null
    },
  }
}

interface MessageMapping {
  incoming(message: OSC.Message): DeviceMessage | true | null
  outgoing?(
    category: string,
    id: string,
    property: string,
    value?: unknown
  ): OSC.Message | true | null
}

export const messageMapping: MessageMapping[] = [
  // fader
  simpleMapping('/mix/fader', 'value', faderConverter),

  // on
  simpleMapping('/mix/on', 'on', onConverter),

  // name
  simpleMapping('/config/name', 'name', nameConverter),

  // TODO meters
]
