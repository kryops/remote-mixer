import { css } from '@linaria/core'
import { ReactNode, useRef } from 'react'
import { ensureBetween } from '@remote-mixer/utils'

import { Touchable } from '../../components/touchable'
import { getTouchEventOffset } from '../../../util/touch'
import { cx } from '../../../util/styles'
import { baseline, iconShade, baselinePx } from '../../styles'

export const faderWidth = baselinePx * 12
export const faderHeight = baselinePx * 60
export const trackWidth = faderWidth / 3
export const trackHeight = faderHeight - faderWidth
export const trackMargin = (faderWidth - trackWidth) / 2
export const trackOffset = (faderHeight - trackHeight) / 2

const faderBase = css`
  position: relative;
  flex: 0 0 auto;
  width: ${faderWidth}px;
  height: ${faderHeight}px;
  margin: ${baseline(1.5)};
`

const colorPickerFader = css`
  margin-left: ${baseline(3.5)};
  margin-right: ${baseline(3.5)};
`

const track = css`
  position: absolute;
  top: ${trackOffset}px;
  left: ${trackMargin}px;
  background: ${iconShade(3)};
  width: ${trackWidth}px;
  height: ${trackHeight}px;
`

const cornerLabelStyle = css`
  position: absolute;
  font-size: 0.65rem;
  z-index: 3;
  top: ${baseline(0.5)};
  left: ${baseline(1)};
`

const cornerLabel_overflow = css`
  min-width: ${baseline(32)};
`

export interface FaderBaseProps {
  cornerLabel?: string
  cornerLabelOverflow?: boolean
  colorPicker?: boolean
  className?: string
  onTouch?: (fraction: number) => void
  onUp?: () => void
  children?: ReactNode
}

export function FaderBase({
  cornerLabel,
  cornerLabelOverflow,
  colorPicker,
  className,
  onTouch,
  onUp,
  children,
}: FaderBaseProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <Touchable
      className={cx(faderBase, colorPicker && colorPickerFader, className)}
      onTouch={event => {
        const offset = getTouchEventOffset(event, trackRef)
        if (!offset) {
          return
        }
        const fraction = ensureBetween(1 - offset.yFraction, 0, 1)
        onTouch?.(fraction)
      }}
      onUp={onUp}
    >
      <div className={track} ref={trackRef} />
      {children}
      {cornerLabel && (
        <div
          className={cx(
            cornerLabelStyle,
            cornerLabelOverflow && cornerLabel_overflow
          )}
        >
          {cornerLabel}
        </div>
      )}
    </Touchable>
  )
}
