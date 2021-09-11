import { DeviceConfiguration } from '@remote-mixer/types'

export const deviceConfig: DeviceConfiguration = {
  categories: [
    {
      key: 'ch',
      label: 'Channels',
      count: 32,
      meters: true,
      additionalProperties: ['on'],
      faderProperties: [
        { key: 'value', label: 'CH' },
        // TODO mix?
      ],
    },
    {
      key: 'bus',
      label: 'BUS',
      count: 16,
      namePrefix: 'BUS',
      additionalProperties: ['on'],
    },
    {
      key: 'mtx',
      label: 'MTX',
      count: 6,
      namePrefix: 'MTX',
      additionalProperties: ['on'],
    },
    {
      key: 'sum',
      label: 'Master',
      count: 1,
      namePrefix: 'SUM',
      additionalProperties: ['on'],
    },
  ],
}
