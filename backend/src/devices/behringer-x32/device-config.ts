import { DeviceConfiguration } from '@remote-mixer/types'
import { arrayRange } from '@remote-mixer/utils'

export const deviceConfig: DeviceConfiguration = {
  categories: [
    {
      key: 'ch',
      label: 'Channels',
      count: 32,
      meters: true,
      namePrefix: 'CH',
      additionalProperties: ['on'],
      faderProperties: [
        { key: 'value', label: 'CH' },
        ...arrayRange(1, 16, it => ({ key: 'mix' + it, label: 'MIX' + it })),
      ],
    },
    {
      key: 'bus',
      label: 'Bus',
      count: 16,
      namePrefix: 'BUS',
      additionalProperties: ['on'],
      faderProperties: [
        { key: 'value', label: 'BUS' },
        ...arrayRange(1, 6, it => ({ key: 'mix' + it, label: 'MIX' + it })),
      ],
    },
    {
      key: 'mtx',
      label: 'Matrix',
      count: 6,
      namePrefix: 'MTX',
      additionalProperties: ['on'],
    },
    {
      key: 'dca',
      label: 'DCA',
      count: 8,
      namePrefix: 'DCA',
      additionalProperties: ['on'],
    },
    {
      key: 'sum',
      label: 'Master',
      count: 1,
      namePrefix: 'SUM',
      additionalProperties: ['on'],
      faderProperties: [
        { key: 'value', label: 'SUM' },
        ...arrayRange(1, 6, it => ({ key: 'mix' + it, label: 'MIX' + it })),
      ],
    },
  ],
}
