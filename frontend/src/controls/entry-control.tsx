import { StateCategoryEntry } from '@remote-mixer/types'

import { sendApiMessage } from '../api/api-wrapper'
import { useDeviceCategory, useEntryState } from '../api/state'
import { useMeter } from '../hooks/meter'
import { Button } from '../ui/buttons/button'
import { Entry } from '../ui/containers/entry'
import { Fader } from '../ui/controls/fader/fader'
import { iconDetails } from '../ui/icons'
import { Icon } from '../ui/icons/icon'

import { showEntryDialog } from './entry-dialog'

export interface EntryControlProps {
  category: string
  id: string
}

export function EntryControl({ category, id }: EntryControlProps) {
  const state = useEntryState(category, id) ?? ({} as StateCategoryEntry)
  const categoryInfo = useDeviceCategory(category)

  function change(property: string, value: any) {
    sendApiMessage({
      type: 'change',
      category,
      id,
      property,
      value,
    })
  }

  const meterRef = useMeter(categoryInfo, id)

  return (
    <Entry inactive={state.on === false}>
      {state.on !== undefined && (
        <Button onDown={() => change('on', !state.on)} active={state.on}>
          ON
        </Button>
      )}
      <Fader
        value={state.value ?? 0}
        onChange={value => change('value', value)}
        max={255}
        step={1}
        label={(categoryInfo.namePrefix ?? '') + id}
        subLabel={state.name}
        meterRef={meterRef}
      />
      {categoryInfo.faderProperties && (
        <Icon
          icon={iconDetails}
          hoverable
          inline
          padding
          onClick={showEntryDialog}
        />
      )}
    </Entry>
  )
}
