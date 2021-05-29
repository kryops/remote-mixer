import { ReactElement, ComponentType } from 'react'
import { css } from '@linaria/core'

import { Icon } from '../icons/icon'
import { zOverlay, primaryShade, baseline, iconShade } from '../styles'
import { iconClose } from '../icons'

import { removeOverlay, addOverlay } from './overlay'
import { ModalButton } from './buttons'

export interface ModalProps<T> {
  onClose: (result: T) => void
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
  background: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  z-index: ${zOverlay};
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
  background: ${primaryShade(3)};

  @media (max-width: 500px) {
    width: 94vw;
    padding: ${baseline(4)};
  }
`

const closeButton = css`
  float: right;
  margin: ${baseline(-6)};
  padding: ${baseline(2)};
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
      onClick={closeOnBackDrop ? () => onClose(null as any) : undefined}
    >
      <div className={modalContainer}>
        <div className={modal}>
          {showCloseButton && (
            <Icon
              icon={iconClose}
              className={closeButton}
              hoverable
              onClick={() => onClose(null as any)}
            />
          )}
          {title && <h2 className={titleStyle}>{title}</h2>}
          {content}
          {Content && <Content onClose={onClose} />}
          {buttons && (
            <div className={buttonContainer}>
              {buttons.map(({ icon, label, value }, index) => (
                <a
                  key={index}
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
): Promise<T> {
  return new Promise<T>(resolve => {
    const Overlay = () => (
      <Modal
        {...props}
        onClose={value => {
          removeOverlay(Overlay)
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
