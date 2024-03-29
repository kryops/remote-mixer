import { css } from '@linaria/core'
import { StateCategoryEntry } from '@remote-mixer/types'

import { Tabs } from '../../ui/containers/tabs'
import { showDialog } from '../../ui/overlays/dialog'
import {
  useDeviceCategory,
  useDeviceConfiguration,
  useEntryState,
} from '../../api/state'
import { sendApiMessage } from '../../api/api-wrapper'
import { Button } from '../../ui/buttons/button'
import { TextInput } from '../../ui/forms/typed-input'
import { baseline } from '../../ui/styles'
import { Icon } from '../../ui/icons/icon'
import { iconColor } from '../../ui/icons'

import { EntryDialogFaders } from './entry-dialog-faders'
import { showColorDialog } from './color-dialog'

const container = css`
  min-width: 80vw;
`

const nameInput = css`
  width: ${baseline(24)};
`

export interface EntryDialogProps {
  category: string
  id: string
}

export function EntryDialog({ category, id }: EntryDialogProps) {
  const configuration = useDeviceConfiguration()
  const categoryInfo = useDeviceCategory(category)
  const state = useEntryState(category, id) ?? ({} as StateCategoryEntry)

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
    <div className={container}>
      <h2>
        {categoryInfo.namePrefix}
        {id}
        &nbsp;
        <TextInput
          className={nameInput}
          value={state.name}
          onChange={newValue => change('name', newValue ?? '')}
        />
        {configuration.colors && (
          <>
            &nbsp;
            <Icon
              icon={iconColor}
              inline
              hoverable
              color={state.color ?? undefined}
              onClick={() =>
                showColorDialog({
                  color: state.color,
                  onChange: newColor => change('color', newColor),
                })
              }
            />
          </>
        )}
        &nbsp;
        <Button onDown={() => change('on', !state.on)} active={state.on}>
          {state.on ? 'ON' : 'OFF'}
        </Button>
      </h2>
      <Tabs
        tabs={[
          {
            id: 'faders',
            label: 'Faders',
            content: <EntryDialogFaders category={category} id={id} />,
          },
          // {
          //   id: 'eq',
          //   label: 'EQ',
          //   content: 'EQ',
          // },
          // {
          //   id: 'effects',
          //   label: 'EFFECTS',
          //   content: 'Effects',
          // },
        ]}
      />
    </div>
  )
}

export async function showEntryDialog(props: EntryDialogProps) {
  await showDialog(<EntryDialog {...props} />, [], {
    showCloseButton: true,
    closeOnBackDrop: true,
  })
}
