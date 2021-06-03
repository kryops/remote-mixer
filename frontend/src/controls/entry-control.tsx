import { Button } from '../ui/buttons/button'
import { Entry } from '../ui/containers/entry'
import { Fader } from '../ui/controls/fader/fader'
import { iconDetails } from '../ui/icons'
import { Icon } from '../ui/icons/icon'

import { showEntryDialog } from './entry-dialog'

export function EntryControl() {
  return (
    <Entry inactive={Math.random() > 0.5}>
      <Button>ON</Button>
      <Fader value={0} onChange={() => {}} label="CH1" subLabel="Name" />
      <Icon
        icon={iconDetails}
        hoverable
        inline
        padding
        onClick={showEntryDialog}
      />
    </Entry>
  )
}
