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
      key: 'auxin',
      label: 'AUX In',
      count: 8,
      meters: true,
      namePrefix: 'A',
      additionalProperties: ['on'],
      faderProperties: [
        { key: 'value', label: 'AUX' },
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
      key: 'st',
      label: 'ST',
      count: 1,
      namePrefix: 'ST',
      additionalProperties: ['on'],
      faderProperties: [
        { key: 'value', label: 'ST' },
        ...arrayRange(1, 6, it => ({ key: 'mix' + it, label: 'MIX' + it })),
      ],
    },
    {
      key: 'm',
      label: 'M',
      count: 1,
      namePrefix: 'M',
      additionalProperties: ['on'],
      faderProperties: [
        { key: 'value', label: 'M' },
        ...arrayRange(1, 6, it => ({ key: 'mix' + it, label: 'MIX' + it })),
      ],
    },
  ],
  colors: [
    '#f00',
    '#0f0',
    '#ff0',
    '#00f',
    '#f0f',
    '#0ff',
    '#fff',
    // inverted
    '#444',
    '#f88',
    '#7f7',
    '#ff7',
    '#77f',
    '#f7f',
    '#7ff',
    '#bbb',
  ],
}
