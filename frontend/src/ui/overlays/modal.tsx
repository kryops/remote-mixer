import { ReactElement, ComponentType } from 'react'
import { css } from '@linaria/core'

import { Icon } from '../icons/icon'
import {
  zOverlay,
  primaryShade,
  baseline,
  iconShade,
  backgroundColor,
} from '../styles'
import { iconClose } from '../icons'
import { lightTheme } from '../../settings'

import { removeOverlay, addOverlay, OverlayProps } from './overlay'
import { ModalButton } from './buttons'

export interface ModalProps<T> {
  /** Called with null if the modal was dismissed without a result */
  onClose: (result: T | null) => void
  showCloseButton?: boolean
  closeOnBackDrop?: boolean
  title?: string | ReactElement
  content: string | ReactElement
  Content?: ComponentType<{ onClose?: (value: T) => void }>
  buttons?: ModalButton<T>[]
}

const backDrop = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(50, 50, 50, 0.8);
  overflow-y: auto;
  z-index: ${zOverlay};

  /* stylelint-disable-next-line selector-no-invalid -- placeholder of the interpolation */
  .${lightTheme} & {
    background: rgba(200, 200, 200, 0.8);
  }
`

const modalContainer = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: ${baseline(2)} ${baseline(0.5)};
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`

const modal = css`
  min-width: ${baseline(76)};
  max-width: 96vw;
  box-sizing: border-box;
  padding: ${baseline(6)} ${baseline(8)};
  background: ${backgroundColor};
  --background: ${backgroundColor};

  @media (max-width: 500px) {
    width: 94vw;
    padding: ${baseline(4)};
  }
`

const closeButton = css`
  float: right;
  margin: ${baseline(-6)};
  padding: ${baseline(2)};

  @media (max-width: 500px) {
    margin: ${baseline(-4)};
  }
`

const titleStyle = css`
  margin-top: 0;
`

const buttonContainer = css`
  display: flex;
  margin-top: ${baseline(4)};
  margin-bottom: ${baseline(-4)};
  border-top: 1px solid ${iconShade(2)};
`

const buttonStyle = css`
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  align-items: center;
  justify-content: center;
  padding: ${baseline(4)};
  box-sizing: content-box;
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  &:active {
    background: ${primaryShade(1)};
  }
`

const buttonIcon = css`
  flex: 0 0 auto;
  padding-right: ${baseline(2)};
`

export function Modal<T>({
  title,
  content,
  Content,
  buttons,
  onClose,
  closeOnBackDrop,
  showCloseButton,
}: ModalProps<T>) {
  return (
    <div
      className={backDrop}
      onClick={closeOnBackDrop ? () => onClose(null) : undefined}
    >
      <div className={modalContainer}>
        <div className={modal} onClick={e => e.stopPropagation()}>
          {showCloseButton && (
            <Icon
              icon={iconClose}
              className={closeButton}
              hoverable
              onClick={() => onClose(null)}
            />
          )}
          {title && <h2 className={titleStyle}>{title}</h2>}
          {content}
          {Content && <Content onClose={onClose} />}
          {buttons && buttons.length > 0 && (
            <div className={buttonContainer}>
              {buttons.map(({ icon, label, value }) => (
                <a
                  key={label}
                  className={buttonStyle}
                  onClick={() => onClose?.(value)}
                >
                  <Icon icon={icon} className={buttonIcon} />
                  <div>{label}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function showModal<T>(
  props: Omit<ModalProps<T>, 'onClose'>,
  registerCloseHandler?: (fn: (value: T) => void) => void
): Promise<T | null> {
  return new Promise<T | null>(resolve => {
    // onClose is provided by the OverlayContainer and removes this overlay.
    // It must not reference Overlay itself, as the React compiler hoists
    // the closure out of the component.
    const Overlay = ({ onClose }: OverlayProps) => (
      <Modal
        {...props}
        onClose={value => {
          onClose?.()
          resolve(value)
        }}
      />
    )
    addOverlay(Overlay)

    registerCloseHandler?.(value => {
      removeOverlay(Overlay)
      resolve(value)
    })
  })
}
