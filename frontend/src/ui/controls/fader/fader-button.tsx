import { css } from '@linaria/core'

import { cx } from '../../../util/styles'
import { smallText } from '../../css/basic-styles'
import { baseline, primaryShade } from '../../styles'

import { faderHeight, faderWidth, trackHeight } from './fader-base'

const buttonHeight = faderWidth * 1.25

const button = css`
  position: absolute;
  width: ${faderWidth}px;
  height: ${buttonHeight}px;
  background: ${primaryShade(0)};
  color: #fff;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  will-change: transform;
  border: ${baseline()} solid ${primaryShade(0)};
  border-left: none;
  border-right: none;
  box-sizing: border-box;
`

const button_small = smallText

const subLabelStyle = css`
  position: absolute;
  bottom: ${baseline()};
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.65rem;
`

export interface FaderButtonProps {
  fraction: number
  label?: string
  subLabel?: string
  height?: number
  color?: string
  className?: string
}

export function FaderButton({
  fraction,
  label,
  subLabel,
  height = faderWidth * 1.25,
  color,
  className,
}: FaderButtonProps) {
  const offset = Math.max(0, (faderHeight - trackHeight) / 2 - height / 2)
  const offsetHeight = faderHeight - height - offset * 2
  const y = Math.round(offset + offsetHeight - fraction * offsetHeight)

  return (
    <div
      className={cx(
        button,
        label && label.length > 3 && button_small,
        className
      )}
      style={{
        height: `${height}px`,
        borderBottomColor: color,
        transform: `translateY(${y}px)`,
      }}
    >
      {label}
      {subLabel && <div className={subLabelStyle}>{subLabel}</div>}
    </div>
  )
}
