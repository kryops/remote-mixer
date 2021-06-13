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
        { key: 'bus1', label: 'BUS1' },
        { key: 'bus2', label: 'BUS2' },
        { key: 'bus3', label: 'BUS3' },
        { key: 'bus4', label: 'BUS4' },
        { key: 'bus5', label: 'BUS5' },
        { key: 'bus6', label: 'BUS6' },
        { key: 'bus7', label: 'BUS7' },
        { key: 'bus8', label: 'BUS8' },
      ],
    },
    {
      key: 'aux',
      label: 'AUX',
      count: 8,
      namePrefix: 'AUX',
    },
    {
      key: 'bus',
      label: 'BUS',
      count: 8,
      namePrefix: 'BUS',
    },
    {
      key: 'sum',
      label: 'Master',
      count: 1,
      namePrefix: 'SUM',
    },
  ],
}
