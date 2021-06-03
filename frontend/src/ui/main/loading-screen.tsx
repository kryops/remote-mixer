import { css } from '@linaria/core'

import { rotateAnimation } from '../animations/rotate'
import { iconLoading } from '../icons'
import { Icon } from '../icons/icon'

const loadingScreen = css`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LoadingScreen = () => (
  <div className={loadingScreen}>
    <Icon icon={iconLoading} className={rotateAnimation} />
  </div>
)
