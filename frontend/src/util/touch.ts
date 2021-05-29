import { PointerEvent, RefObject, TouchEvent } from 'react'
import { ensureBetween } from '@remote-mixer/utils'

export interface NormalizedTouchEvent<T extends HTMLElement = HTMLElement> {
  type: string
  clientX: number
  clientY: number
  originalEvent: PointerEvent<T> | TouchEvent<T>
}

export function normalizeTouchEvent<T extends HTMLElement = HTMLElement>(
  e: PointerEvent<T> | TouchEvent<T>
): NormalizedTouchEvent<T> {
  if ((e as any).clientX) {
    const pointerEvent = e as PointerEvent<T>
    return {
      type: e.type,
      clientX: pointerEvent.clientX,
      clientY: pointerEvent.clientY,
      originalEvent: e,
    }
  }

  const touchEvent = e as TouchEvent<T>
  const touch = touchEvent.targetTouches?.[0] ?? touchEvent.changedTouches?.[0]
  return {
    type: e.type,
    clientX: touch?.clientX,
    clientY: touch?.clientY,
    originalEvent: e,
  }
}

export interface OffsetCoordinates {
  x: number
  y: number
  xFraction: number
  yFraction: number
  width: number
  height: number
}

export function getTouchEventOffset(
  e: NormalizedTouchEvent<HTMLElement>,
  ref: RefObject<HTMLElement>
): OffsetCoordinates | null {
  if (!ref.current) {
    return null
  }

  const elPosition = ref.current.getBoundingClientRect()

  const { width, height } = elPosition
  const x = e.clientX - elPosition.left
  const y = e.clientY - elPosition.top
  const xFraction = x / width
  const yFraction = y / height

  return { x, y, xFraction, yFraction, width, height }
}

export function getFractionWithMargin(
  offset: OffsetCoordinates,
  margin: number
): { x: number; y: number } {
  const x = ensureBetween(
    (offset.x - margin) / (offset.width - margin * 2),
    0,
    1
  )
  const y = ensureBetween(
    (offset.y - margin) / (offset.height - margin * 2),
    0,
    1
  )
  return { x, y }
}
