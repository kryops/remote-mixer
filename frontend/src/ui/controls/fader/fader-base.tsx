import { css } from '@linaria/core'
import { ReactNode, useRef } from 'react'
import { ensureBetween } from '@remote-mixer/utils'

import { Touchable } from '../../components/touchable'
import { getTouchEventOffset } from '../../../util/touch'
import { cx } from '../../../util/styles'
import { baseline, iconShade, baselinePx } from '../../styles'

export const faderWidth = baselinePx * 12
export const faderHeight = baselinePx * 60
export const trackWidth = (baselinePx * 12) / 3
export const trackHeight = faderHeight - faderWidth
export const trackMargin = (faderWidth - trackWidth) / 2
export const trackOffset = (faderHeight - trackHeight) / 2

const faderBase = css`
  position: relative;
  transform: translate3d(0, 0, 0);
  flex: 0 0 auto;
  width: ${faderWidth}px;
  height: ${faderHeight}px;
  margin: ${baseline(1.5)};
`

const track = css`
  margin-top: ${trackOffset}px;
  margin-left: ${trackMargin}px;
  background: ${iconShade(3)};
  width: ${trackWidth}px;
  height: ${trackHeight}px;
`

const meterTrack = css`
  background: ${iconShade(2)};
  height: ${trackHeight}px;
  will-change: transform;
  transform-origin: bottom;
  transition: transform 0.1s ease-out;
`

export interface FaderBaseProps {
  className?: string
  onTouch?: (fraction: number) => void
  onUp?: () => void
  children?: ReactNode
  meterRef?: React.RefObject<HTMLDivElement>
}

export function FaderBase({
  className,
  onTouch,
  onUp,
  children,
  meterRef,
}: FaderBaseProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <Touchable
      className={cx(faderBase, className)}
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
      {children}
      <div className={track} ref={trackRef}>
        {meterRef && <div className={meterTrack} ref={meterRef} />}
      </div>
    </Touchable>
  )
}
