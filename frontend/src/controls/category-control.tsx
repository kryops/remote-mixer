import { DeviceConfigurationCategory } from '@remote-mixer/types'
import { createRangeArray } from '@remote-mixer/utils'

import { EntryContainer } from '../ui/containers/entry-container'
import { Tabs } from '../ui/containers/tabs'

import { EntryControl } from './entry-control'

export interface CategoryControlProps {
  category: DeviceConfigurationCategory
}

export function CategoryControl({ category }: CategoryControlProps) {
  const properties = category.faderProperties ?? [
    { key: 'value', label: 'Value' },
  ]

  return (
    <Tabs
      tabs={properties.map(({ key, label }) => ({
        id: key,
        label,
        content: (
          <EntryContainer>
            {createRangeArray(1, category.count).map(id => (
              <EntryControl
                key={id}
                category={category.key}
                id={String(id)}
                property={key}
              />
            ))}
          </EntryContainer>
        ),
      }))}
    />
  )
}
