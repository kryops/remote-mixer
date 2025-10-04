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
      faderProperties: [
        { key: 'value', label: 'CH' },
        ...arrayRange(1, 8, it => ({ key: 'aux' + it, label: 'AUX' + it })),
      ],
      additionalProperties: ['on', 'paired'],
      modes: ['full', 'iem'],
    },
    {
      key: 'aux',
      label: 'AUX',
      count: 8,
      namePrefix: 'AUX',
      additionalProperties: ['on', 'paired'],
      modes: ['full'],
    },
    {
      key: 'bus',
      label: 'BUS',
      count: 8,
      namePrefix: 'BUS',
      additionalProperties: ['on', 'paired'],
      modes: ['full'],
    },
    {
      key: 'sum',
      label: 'Master',
      count: 1,
      namePrefix: 'SUM',
      additionalProperties: ['on'],
      modes: ['full'],
    },
  ],
}
