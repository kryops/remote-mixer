import { css } from '@linaria/core'

import { Tabs } from '../ui/containers/tabs'
import { Entry } from '../ui/containers/entry'
import { EntryContainer } from '../ui/containers/entry-container'
import { Fader } from '../ui/controls/fader/fader'
import { showDialog } from '../ui/overlays/dialog'

const container = css`
  min-width: 80vw;
  min-height: 50vh;
`

export function EntryDialog() {
  return (
    <div className={container}>
      <h2>CH1</h2>
      <Tabs
        tabs={[
          {
            id: 'faders',
            label: 'Faders',
            content: (
              <EntryContainer noWrap>
                <Entry>
                  <Fader value={0} onChange={() => {}} />
                </Entry>
              </EntryContainer>
            ),
          },
          {
            id: 'eq',
            label: 'EQ',
            content: 'EQ',
          },
          {
            id: 'effects',
            label: 'EFFECTS',
            content: 'Effects',
          },
        ]}
      />
    </div>
  )
}

export async function showEntryDialog() {
  await showDialog(<EntryDialog />, [], {
    showCloseButton: true,
    closeOnBackDrop: true,
  })
}
