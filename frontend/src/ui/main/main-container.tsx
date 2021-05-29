import { css } from '@linaria/core'

import { baseline, iconShade } from '../styles'
import { memoInProduction } from '../../util/development'
import { Fader } from '../controls/fader/fader'

import { CornerOverlay } from './corner-overlay'

const mainContainer = css`
  display: flex;
  height: 100%;
`

const content = css`
  flex: 1 1 auto;
  padding: ${baseline(4)};
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 800px) {
    ::-webkit-scrollbar {
      width: ${baseline()};
      background: ${iconShade(3)};
    }

    ::-webkit-scrollbar-thumb {
      background: ${iconShade(1)};
    }
  }
`

export const MainContainer = memoInProduction(() => {
  return (
    <div className={mainContainer}>
      <div className={content}>
        <Fader value={0} onChange={() => {}} />
        ...
      </div>
      <CornerOverlay />
    </div>
  )
})
