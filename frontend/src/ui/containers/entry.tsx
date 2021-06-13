import { css } from '@linaria/core'
import { ReactNode } from 'react'

import { cx } from '../../util/styles'
import { centeredText } from '../css/basic-styles'
import { baseline } from '../styles'

const entry = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${baseline(2)} 0;
`

const entryInactive = css`
  opacity: 0.6;
`

export interface EntryProps {
  inactive?: boolean
  className?: string
  children: ReactNode
}

export function Entry({ children, inactive, className }: EntryProps) {
  return (
    <div
      className={cx(entry, centeredText, inactive && entryInactive, className)}
    >
      {children}
    </div>
  )
}
