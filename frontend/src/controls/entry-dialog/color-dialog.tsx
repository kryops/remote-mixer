import { css } from '@linaria/core'

import { showDialog } from '../../ui/overlays/dialog'
import { useDeviceConfiguration } from '../../api/state'
import { baseline, iconShade } from '../../ui/styles'
import { cx } from '../../util/styles'

const container = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: ${baseline(150)};
`

const colorEntry = css`
  width: ${baseline(8)};
  height: ${baseline(8)};
  margin: ${baseline()};
  box-sizing: border-box;
`

const colorEntry_active = css`
  border: ${baseline(0.5)} solid ${iconShade(0)};
`

const baseColors: string[] = []
const baseColorSteps = ['0', '5', '8', 'b', 'f']
for (const b of baseColorSteps) {
  for (const g of baseColorSteps) {
    for (const r of baseColorSteps) {
      const color = '#' + r + g + b
      if (color !== '#000') baseColors.push(color)
    }
  }
}

export interface ColorDialogProps {
  color: string | null | undefined
  onChange: (newColor: string | null) => void
}

export function ColorDialog({ color, onChange }: ColorDialogProps) {
  const configuration = useDeviceConfiguration()
  const colors = Array.isArray(configuration.colors)
    ? configuration.colors
    : baseColors

  return (
    <div className={container}>
      <div
        className={cx(colorEntry, color === null && colorEntry_active)}
        onClick={() => onChange(null)}
      />
      {colors.map(c => (
        <div
          key={c}
          className={cx(colorEntry, c === color && colorEntry_active)}
          style={{ background: c }}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}

export async function showColorDialog({ color, onChange }: ColorDialogProps) {
  let closeHandler: (value: true) => void
  await showDialog(
    <ColorDialog
      color={color}
      onChange={color => {
        closeHandler?.(true)
        onChange(color)
      }}
    />,
    [],
    {
      showCloseButton: true,
      closeOnBackDrop: true,
    },
    x => (closeHandler = x)
  )
}
