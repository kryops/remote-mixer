import { DeviceConfiguration } from '@remote-mixer/types'

export const deviceConfig: DeviceConfiguration = {
  categories: [
    {
      key: 'ch',
      label: 'Channels',
      count: 32,
      meters: true,
      faderProperties: [
        { key: 'value', label: 'CH' },
        { key: 'aux1', label: 'AUX1' },
        { key: 'aux2', label: 'AUX2' },
        { key: 'aux3', label: 'AUX3' },
        { key: 'aux4', label: 'AUX4' },
        { key: 'aux5', label: 'AUX5' },
        { key: 'aux6', label: 'AUX6' },
        { key: 'aux7', label: 'AUX7' },
        { key: 'aux8', label: 'AUX8' },
      ],
      additionalProperties: ['on'],
    },
    {
      key: 'aux',
      label: 'AUX',
      count: 8,
      namePrefix: 'AUX',
      additionalProperties: ['on'],
    },
    {
      key: 'bus',
      label: 'BUS',
      count: 8,
      namePrefix: 'BUS',
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
