import { css } from '@linaria/core'

import { baseline, iconShade } from '../styles'
import { memoInProduction } from '../../util/development'
import { Tabs } from '../containers/tabs'
import { EntryControl } from '../../controls/entry-control'
import { EntryContainer } from '../containers/entry-container'
import { EntryDialog } from '../../controls/entry-dialog'

import { CornerOverlay } from './corner-overlay'

const mainContainer = css`
  display: flex;
  height: 100%;
`

const content = css`
  flex: 1 1 auto;
  padding: ${baseline(3)};
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
        <Tabs
          tabs={[
            {
              id: 1,
              content: (
                <EntryContainer>
                  <EntryControl />
                  <EntryControl />
                  <EntryControl />
                  <EntryControl />
                </EntryContainer>
              ),
              label: 'Tab 1',
            },
            {
              id: 2,
              content: <EntryDialog />,
              label: 'Tab 2',
            },
          ]}
        />
      </div>
      <CornerOverlay />
    </div>
  )
})
