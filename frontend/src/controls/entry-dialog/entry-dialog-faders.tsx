import { StateCategoryEntry } from '@remote-mixer/types'

import { Entry } from '../../ui/containers/entry'
import { EntryContainer } from '../../ui/containers/entry-container'
import { Fader } from '../../ui/controls/fader/fader'
import { useDeviceCategory, useEntryState } from '../../api/state'
import { sendApiMessage } from '../../api/api-wrapper'
import { useMeter } from '../../hooks/meter'

export interface EntryDialogFadersProps {
  category: string
  id: string
}

export function EntryDialogFaders({ category, id }: EntryDialogFadersProps) {
  const state = useEntryState(category, id) ?? ({} as StateCategoryEntry)
  const categoryInfo = useDeviceCategory(category)

  const meterRef = useMeter(categoryInfo, id)

  const properties = categoryInfo.faderProperties ?? [
    { key: 'value', label: 'Value' },
  ]

  function change(changedProperty: string, value: any) {
    sendApiMessage({
      type: 'change',
      category,
      id,
      property: changedProperty,
      value,
    })
  }

  return (
    <EntryContainer noWrap>
      {properties.map(({ key, label }) => (
        <Entry key={key}>
          <Fader
            value={state[key] ?? 0}
            onChange={value => change(key, value)}
            max={255}
            step={1}
            label={label}
            meterRef={key === 'value' ? meterRef : undefined}
            category={category}
            id={id}
          />
        </Entry>
      ))}
    </EntryContainer>
  )
}
