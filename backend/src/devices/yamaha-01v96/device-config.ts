import { DeviceConfiguration } from '@remote-mixer/types'

export const deviceConfig: DeviceConfiguration = {
  categories: [
    {
      key: 'ch',
      label: 'Channels',
      count: 32,
      meters: true,
      faderProperties: [
        'aux1',
        'aux2',
        'aux3',
        'aux4',
        'aux5',
        'aux6',
        'aux7',
        'aux8',
        'bus1',
        'bus2',
        'bus3',
        'bus4',
        'bus5',
        'bus6',
        'bus7',
        'bus8',
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
