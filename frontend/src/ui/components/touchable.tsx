import { css } from '@linaria/core'
import { forwardRef, PointerEvent, TouchEvent, useRef } from 'react'

import { NormalizedTouchEvent, normalizeTouchEvent } from '../../util/touch'
import { cx } from '../../util/styles'

const pointerEventSupport = 'PointerEvent' in window

const touchable = css`
  touch-action: none;
`

export type TouchEventListener = (
  e: NormalizedTouchEvent<HTMLDivElement>
) => void
export type RawTouchEventListener = (
  e: PointerEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
) => void

export interface TouchableProps {
  onTouch?: TouchEventListener
  onDown?: TouchEventListener
  onUp?: TouchEventListener
  onMove?: TouchEventListener
  className?: string
  title?: string
}

export const Touchable = forwardRef<
  HTMLDivElement,
  TouchableProps & { children: any }
>(({ onTouch, onDown, onUp, onMove, className, children, title }, ref) => {
  const pointerActive = useRef(false)

  const downListener: RawTouchEventListener | undefined =
    (onTouch || onDown) &&
    (e => {
      const normalized = normalizeTouchEvent(e)
      if (onTouch) {
        onTouch(normalized)
      }
      if (onDown) {
        onDown(normalized)
      }
    })
  const upListener: RawTouchEventListener | undefined =
    (onTouch || onUp) &&
    (e => {
      if (pointerEventSupport && !pointerActive.current) {
        return
      }
      const normalized = normalizeTouchEvent(e)
      if (onTouch) {
        onTouch(normalized)
      }
      if (onUp) {
        onUp(normalized)
      }
    })
  const moveListener: RawTouchEventListener | undefined =
    (onTouch || onMove) &&
    (e => {
      const normalized = normalizeTouchEvent(e)
      if (pointerEventSupport && !pointerActive.current) {
        return
      }
      if (onTouch) {
        onTouch(normalized)
      }
      if (onMove) {
        onMove(normalized)
      }
    })

  return (
    <div
      className={cx(touchable, className)}
      title={title}
      ref={ref}
      onPointerDown={
        pointerEventSupport
          ? e => {
              ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
              pointerActive.current = true
              if (downListener) {
                downListener(e)
              }
            }
          : undefined
      }
      onPointerUp={
        pointerEventSupport
          ? e => {
              if (upListener) {
                upListener(e)
              }
              pointerActive.current = false
            }
          : undefined
      }
      onPointerMove={pointerEventSupport ? moveListener : undefined}
      onTouchStart={!pointerEventSupport ? downListener : undefined}
      onTouchEnd={!pointerEventSupport ? upListener : undefined}
      onTouchMove={!pointerEventSupport ? moveListener : undefined}
    >
      {children}
    </div>
  )
})
