import { css } from '@linaria/core'
import { MouseEvent as ReactMouseEvent } from 'react'

import { baseline, ColorShade, iconShade } from '../styles'
import { cx } from '../../util/styles'

const iconSize = baseline(6)

const iconSvg = css`
  width: ${iconSize};
  height: ${iconSize};
  display: block;
  flex: 0 0 auto;
`

const icon_inline = css`
  display: inline;
  vertical-align: middle;
  position: relative;
  top: ${baseline(-0.5)};
`

const icon_clickable = css`
  cursor: pointer;

  &:active {
    filter: drop-shadow(0 0 ${baseline()} ${iconShade(1)});
  }
`

const icon_hoverable = css`
  fill: var(--color1);

  svg:hover > & {
    fill: var(--color2);
  }
`

const icon_padding = css`
  padding: ${baseline(2)};
`

export interface IconProps {
  icon: string
  shade?: ColorShade
  color?: string
  size?: number
  className?: string
  pathClassName?: string
  inline?: boolean
  padding?: boolean
  hoverable?: boolean
  onClick?: (event: ReactMouseEvent<SVGSVGElement, MouseEvent>) => void
}

export const Icon = ({
  icon,
  shade = 0,
  className,
  pathClassName,
  color,
  size,
  inline,
  padding,
  hoverable,
  onClick,
}: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cx(
        iconSvg,
        inline && icon_inline,
        onClick && icon_clickable,
        padding && icon_padding,
        className
      )}
      style={{
        fill: color ?? iconShade(shade),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '--color1': color ? color : iconShade(shade + 1),
        '--color2': color ? color : iconShade(shade),
        width: size ? baseline(size) : undefined,
        height: size ? baseline(size) : undefined,
      }}
      onClick={onClick}
    >
      <path
        d={icon}
        className={cx(pathClassName, hoverable && icon_hoverable)}
      />
    </svg>
  )
}
