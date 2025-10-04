import {
  roundToStep,
  fractionToValue,
  valueToFraction,
} from '@remote-mixer/utils'

import { useDelayedState } from '../../../hooks/delayed-state'

import { FaderBase } from './fader-base'
import { FaderButton } from './fader-button'
import { useEntryState } from '../../../api/state'

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
  category: string
  id: string
}

const pairColors = [
  '#e6194B',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#42d4f4',
  '#f032e6',
  '#bfef45',
  '#fabed4',
  '#469990',
  '#dcbeff',
  '#9A6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
]

export const Fader = ({
  value,
  min = 0,
  max = 100,
  step,
  label,
  subLabel,
  color,
  onChange,
  meterRef,
  category,
  id,
}: FaderProps) => {
  const [localValue, setLocalValue] = useDelayedState<number | null>(null)
  const valueToUse = localValue ?? value
  const state = useEntryState(category, id)

  let pairColor = color
  if (state?.paired) {
    const pairIndex = Math.floor((parseInt(id) - 1) / 2)
    pairColor = pairColors[pairIndex % pairColors.length]
  }

  return (
    <FaderBase
      meterRef={meterRef}
      onTouch={fraction => {
        const newRawValue = fractionToValue(fraction, min, max)
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
        color={pairColor}
      />
    </FaderBase>
  )
}
