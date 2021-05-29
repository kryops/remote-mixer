import { css } from '@linaria/core'
import { ReactNode } from 'react'

import { baseline, iconShade, primaryShade, textShade } from '../styles'
import { cx } from '../../util/styles'
import { Touchable } from '../components/touchable'
import { Icon } from '../icons/icon'

const button = css`
  display: inline-block;
  padding: ${baseline(2)} ${baseline(3)};
  background: ${primaryShade(2)};
  margin-left: ${baseline()};
  color: ${textShade(0)};
  border: none;
  text-align: center;
  cursor: pointer;

  &:hover,
  &:active {
    background: ${primaryShade(1)};
  }

  &:active,
  &:focus {
    outline: none;
  }

  &:active > svg {
    filter: drop-shadow(0 0 ${baseline(0.5)} ${iconShade(0)});
  }
`

const button_active = css`
  background: ${primaryShade(1)};
`

const button_inactive = css`
  &:active,
  &:hover,
  &:focus {
    background: ${primaryShade(2)};
  }
`

const button_disabled = css`
  opacity: 0.6;
`

const button_transparent = css`
  background: transparent;
  margin-left: 0;

  &:hover,
  &:active {
    background: transparent;
  }
`

const buttonBlock = css`
  display: block;
  width: 100%;
  margin: ${baseline()} 0;
`

const iconStyle = css`
  margin-right: ${baseline()};
`

export interface ButtonProps {
  children?: ReactNode
  onDown?: () => void
  onUp?: () => void
  icon?: string
  iconColor?: string
  block?: boolean
  active?: boolean
  disabled?: boolean
  transparent?: boolean
  className?: string
  title?: string
}

export function Button({
  children,
  onDown,
  onUp,
  block,
  icon,
  iconColor,
  active,
  disabled,
  transparent,
  className,
  title,
}: ButtonProps) {
  const transparentIcon = !children && transparent

  return (
    <Touchable
      className={cx(
        button,
        block && buttonBlock,
        active === true && button_active,
        (active === false || disabled) && button_inactive,
        disabled && button_disabled,
        transparent && button_transparent,
        className
      )}
      title={title}
      onDown={onDown}
      onUp={onUp}
    >
      {icon && (
        <Icon
          icon={icon}
          color={iconColor}
          inline
          className={children ? iconStyle : undefined}
          hoverable={transparentIcon}
          shade={transparentIcon ? 0 : 1}
        />
      )}
      {children}
    </Touchable>
  )
}
