import { DeviceMessage } from '@remote-mixer/types'
import { OSC } from 'osc'

import {
  data2Fader,
  data2Id,
  DataConverter,
  faderConverter,
  id2Data,
  levelConverter,
  nameConverter,
  onConverter,
} from './converters'

const categoryByPrefix: { [prefix: string]: string } = {
  '/ch/': 'ch',
  '/bus/': 'bus',
  '/mtx/': 'mtx',
  '/dca/': 'dca',
  '/main/st': 'sum',
}

const globalCategories = new Set(['sum'])
const categoriesWithoutPadding = new Set(['dca'])

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
          const id = globalCategories.has(category)
            ? '1'
            : data2Id(message.address.slice(prefix.length, prefix.length + 2))

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
          const idData = globalCategories.has(category)
            ? ''
            : categoriesWithoutPadding.has(category)
            ? id
            : id2Data(id)
          const address = prefix + idData + suffix
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

  // mix
  {
    incoming: message => {
      const match = message.address.match(/\/mix\/(\d+)\/level$/)
      if (!match) return null

      for (const [prefix, category] of Object.entries(categoryByPrefix)) {
        if (message.address.startsWith(prefix)) {
          const id = globalCategories.has(category)
            ? '1'
            : data2Id(message.address.slice(prefix.length, prefix.length + 2))

          const value = levelConverter.incoming(message.args[0])
          return {
            type: 'change',
            category,
            id,
            property: 'mix' + data2Id(match[1]),
            value,
          }
        }
      }

      return null
    },
    outgoing: (category, id, p, value) => {
      if (!p.startsWith('mix')) return null

      for (const [prefix, c] of Object.entries(categoryByPrefix)) {
        if (c === category) {
          const idData = globalCategories.has(category)
            ? ''
            : categoriesWithoutPadding.has(category)
            ? id
            : id2Data(id)
          const mix = id2Data(p.slice(3))
          const address = prefix + idData + '/mix/' + mix + '/level'
          return {
            address,
            args: value !== undefined ? [levelConverter.outgoing(value)] : [],
          }
        }
      }

      return null
    },
  },

  // meters
  {
    incoming: message => {
      if (message.address !== '/meters/13') return null

      const data = Buffer.from(message.args[0])

      const outMessage: DeviceMessage = {
        type: 'meters',
        meters: {},
      }

      for (let channel = 1; channel <= 32; channel++) {
        // offset 4: first int (byte length) is cut off by osc.js
        const dataOffset = 4
        // TODO the X32 emulator seems to report the wrong byte length.
        // Check with actual console if it behaves the same
        if (data.length < dataOffset + channel * 4) break
        outMessage.meters[`ch${channel}`] = data2Fader(
          data.readFloatLE(dataOffset + (channel - 1) * 4)
        )
      }

      return outMessage
    },
  },
]
