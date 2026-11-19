import { css } from '@linaria/core'

import { getCssVariableDefinitions } from './styles'

export const lightTheme = css`
  ${getCssVariableDefinitions(true)}
`
