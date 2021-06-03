export interface DeviceConfigurationCategory {
  key: string
  label: string
  count: number
  namePrefix?: string
  meters?: boolean
  faderProperties?: string[]
}

export interface DeviceConfiguration {
  categories: DeviceConfigurationCategory[]
}
