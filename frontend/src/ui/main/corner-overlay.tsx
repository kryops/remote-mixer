import { css } from '@linaria/core'

import { sendApiMessage } from '../../api/api-wrapper'
import {
  toggleBypassIemMode,
  useBypassIemMode,
  useRemoteMixerMode,
} from '../../api/state'
import { useSettings } from '../../hooks/settings'
import { iconFullscreen, iconLight, iconSync, iconTune } from '../icons'
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

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    void document.exitFullscreen()
  }
}

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1')

export function CornerOverlay() {
  const { lightMode, updateSettings } = useSettings()
  const serverMode = useRemoteMixerMode()
  const bypassIemMode = useBypassIemMode()
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
        <Icon
          className={cornerIcon}
          icon={iconFullscreen}
          hoverable
          onClick={toggleFullScreen}
        />
        {isLocalhost && serverMode === 'iem' && (
          <div
            title={
              bypassIemMode
                ? 'IEM mode bypassed – click to restore'
                : 'Bypass IEM mode (show full options)'
            }
          >
            <Icon
              className={cornerIcon}
              icon={iconTune}
              shade={1}
              hoverable
              onClick={toggleBypassIemMode}
            />
          </div>
        )}
      </div>
    </>
  )
}
