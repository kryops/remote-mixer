import { css } from '@linaria/core'
import { ReactNode } from 'react'

import { cx } from '../../util/styles'
import { baseline } from '../styles'

export const container = css`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${baseline(2)};
  padding-right: ${baseline(8)};
`

export const containerNoWrap = css`
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-right: 0;
  padding-bottom: ${baseline(8)};
`

export interface EntryContainerProps {
  className?: string
  children: ReactNode
  noWrap?: boolean
}

export function EntryContainer({
  className,
  children,
  noWrap,
}: EntryContainerProps) {
  return (
    <div className={cx(container, className, noWrap && containerNoWrap)}>
      {children}
    </div>
  )
}
