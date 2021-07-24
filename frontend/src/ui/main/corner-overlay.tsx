import { css } from '@linaria/core'

import { sendApiMessage } from '../../api/api-wrapper'
import { useSettings } from '../../hooks/settings'
import { iconLight, iconSync } from '../icons'
import { Icon } from '../icons/icon'
import { zCornerOverlay, baseline } from '../styles'

const cornerOverlay = css`
  position: absolute;
  z-index: ${zCornerOverlay};
  transform: translate3d(0, 0, 0);
  bottom: 0;
  right: 0;
`

const cornerIcon = css`
  padding: ${baseline(2)};
`

export function CornerOverlay() {
  const { lightMode, updateSettings } = useSettings()
  return (
    <>
      <div className={cornerOverlay}>
        <Icon
          className={cornerIcon}
          icon={iconSync}
          hoverable
          onClick={() => sendApiMessage({ type: 'sync-device' })}
        />
        <Icon
          className={cornerIcon}
          icon={iconLight}
          hoverable
          onClick={() => updateSettings({ lightMode: !lightMode })}
        />
      </div>
    </>
  )
}
