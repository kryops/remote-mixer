import { css } from '@linaria/core'

import { baseline, iconShade } from '../styles'
import { memoInProduction } from '../../util/development'
import { Tabs } from '../containers/tabs'
import { useDeviceConfiguration } from '../../api/state'
import { CategoryControl } from '../../controls/category-control'

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
  const { categories } = useDeviceConfiguration()

  return (
    <div className={mainContainer}>
      <div className={content}>
        <Tabs
          tabs={categories.map(category => ({
            id: category.key,
            label: category.label,
            content: <CategoryControl category={category} />,
          }))}
        />
      </div>
      <CornerOverlay />
    </div>
  )
})
