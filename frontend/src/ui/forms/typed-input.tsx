import { useEffect, useState } from 'react'

import { Input } from './input'

export interface TypedInputProps<T> {
  value: T | undefined
  onChange: (value: T | undefined) => void
  className?: string
}

export function TextInput({
  value,
  onChange,
  ...rest
}: TypedInputProps<string>) {
  return (
    <Input
      value={value ?? ''}
      onChange={newValue => onChange(newValue === '' ? undefined : newValue)}
      {...rest}
    />
  )
}

export interface NumberInputProps extends TypedInputProps<number> {
  min?: number
  max?: number
}

export function NumberInput({ value, onChange, ...rest }: NumberInputProps) {
  // To allow undefined here even if it is not applied from above
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  return (
    <Input
      type="number"
      value={String(internalValue ?? '')}
      onChange={newValue => {
        const numberValue = newValue === '' ? undefined : parseFloat(newValue)
        setInternalValue(numberValue)
        onChange(numberValue)
      }}
      {...rest}
    />
  )
}
