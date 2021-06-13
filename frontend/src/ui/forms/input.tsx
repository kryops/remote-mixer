import { css } from '@linaria/core'
import { InputHTMLAttributes } from 'react'

import { cx } from '../../util/styles'
import { backgroundColor, textShade, baseline, inputWidth } from '../styles'

export interface InputProps extends InputHTMLAttributes<any> {
  type?: 'text' | 'number' | 'date' | 'time' | 'password'
  value: string
  onChange: (value: any) => void
  className?: string
}

const input = css`
  flex: 1 1 auto;
  width: ${inputWidth};
  max-width: 100%;
  padding: ${baseline()};
  background: ${backgroundColor};
  color: ${textShade(0)};
  border: 1px solid ${textShade(1)};
`

export function Input({
  type = 'text',
  value,
  onChange,
  className,
  ...rest
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={event => onChange(event.target.value)}
      className={cx(input, className)}
      {...rest}
    />
  )
}
