import { memoInProduction } from '../../../util/development'
import { cx } from '../../../util/styles'
import { centeredText, smallText } from '../../css/basic-styles'
import { Icon } from '../../icons/icon'

import { Fader } from './fader'

export interface FaderWithContainerProps {
  value: number
  min?: number
  max?: number
  step?: number
  label?: string
  subLabel?: string
  bottomLabel?: string
  bottomIcon?: string
  onBottomIconClick?: () => any
  className?: string
  faderClassName?: string
  onChange: (value: number) => void
}

export const FaderWithContainer = memoInProduction(
  ({
    bottomLabel,
    bottomIcon,
    onBottomIconClick,
    className,
    faderClassName,
    ...passThrough
  }: FaderWithContainerProps) => {
    return (
      <div className={cx(centeredText, className)}>
        <Fader {...passThrough} className={faderClassName} />
        {bottomLabel && <div className={smallText}>{bottomLabel}</div>}
        {bottomIcon && (
          <Icon
            icon={bottomIcon}
            hoverable
            inline
            padding
            onClick={onBottomIconClick}
          />
        )}
      </div>
    )
  }
)
