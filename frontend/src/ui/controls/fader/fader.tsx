import {
  roundToStep,
  fractionToValue,
  valueToFraction,
} from '@remote-mixer/utils'

import { useDelayedState } from '../../../hooks/delayed-state'

import { FaderBase } from './fader-base'
import { FaderButton } from './fader-button'

export interface FaderProps {
  value: number
  min?: number
  max?: number
  step?: number
  label?: string
  subLabel?: string
  color?: string
  meterRef?: React.RefObject<HTMLDivElement | null>
  onChange: (value: number) => void
  className?: string
}

export const Fader = ({
  value,
  min = 0,
  max = 100,
  step,
  label,
  subLabel,
  color,
  onChange,
  ...passThrough
}: FaderProps) => {
  const [localValue, setLocalValue] = useDelayedState<number | null>(null)
  const valueToUse = localValue ?? value

  return (
    <FaderBase
      {...passThrough}
      onTouch={fraction => {
        const newRawValue = fractionToValue(fraction, min, max)
        if (newRawValue === valueToUse) {
          return
        }
        setLocalValue(newRawValue)
        const roundedValue = roundToStep(newRawValue, step)
        onChange(roundedValue)
      }}
      onUp={() => setLocalValue(null, true)}
    >
      <FaderButton
        fraction={valueToFraction(valueToUse, min, max)}
        label={label}
        subLabel={subLabel}
        color={color}
      />
    </FaderBase>
  )
}
