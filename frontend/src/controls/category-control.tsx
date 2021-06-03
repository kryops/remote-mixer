import { DeviceConfigurationCategory } from '@remote-mixer/types'
import { createRangeArray } from '@remote-mixer/utils'

import { EntryContainer } from '../ui/containers/entry-container'

import { EntryControl } from './entry-control'

export interface CategoryControlProps {
  category: DeviceConfigurationCategory
}

export function CategoryControl({ category }: CategoryControlProps) {
  return (
    <EntryContainer>
      {createRangeArray(1, category.count).map(id => (
        <EntryControl key={id} category={category.key} id={String(id)} />
      ))}
    </EntryContainer>
  )
}
