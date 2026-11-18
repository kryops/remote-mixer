import { css } from '@linaria/core'
import { ReactNode, useDeferredValue, useState } from 'react'

import { cx } from '../../util/styles'
import { backgroundColor, baseline, iconShade } from '../styles'
import { Clickable } from '../components/clickable'

const tabBar = css`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid ${iconShade(1)};
  margin-bottom: ${baseline(2)};
`

const tabStyle = css`
  padding: ${baseline(2)} ${baseline(1.5)};
  margin: 0 ${baseline(1 / 2)};
  margin-bottom: -1px;
  white-space: nowrap;
`

const activeTabStyle = css`
  border: 1px solid ${iconShade(1)};
  border-bottom-color: var(--background, ${backgroundColor});
`

export interface Tab {
  id: any
  label: string
  content: ReactNode
}

export interface TabsProps {
  tabs: Tab[]
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? null)

  // Fall back to the first tab if the selected one disappeared
  const effectiveActiveTab = tabs.some(tab => tab.id === activeTab)
    ? activeTab
    : (tabs[0]?.id ?? null)

  const deferredActiveTab = useDeferredValue(effectiveActiveTab)

  if (tabs.length === 0) return null
  if (tabs.length === 1) return <>{tabs[0].content}</>

  return (
    <>
      <div className={tabBar}>
        {tabs.map(tab => (
          <Clickable
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cx(
              tabStyle,
              tab.id === effectiveActiveTab && activeTabStyle
            )}
          >
            {tab.label}
          </Clickable>
        ))}
      </div>
      {tabs.find(tab => tab.id === deferredActiveTab)?.content}
    </>
  )
}
