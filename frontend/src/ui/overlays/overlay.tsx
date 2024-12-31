import { ComponentType, useEffect, useState, PropsWithChildren } from 'react'
import { addToMutableArray, removeFromMutableArray } from '@remote-mixer/utils'

export interface OverlayProps {
  onClose?: () => void
}

const overlays: ComponentType<OverlayProps>[] = []

let overlaysChanged: (() => void) | null = null

export function addOverlay(component: ComponentType<OverlayProps>) {
  addToMutableArray(overlays, component)
  overlaysChanged?.()
}

export function removeOverlay(component: ComponentType<OverlayProps>) {
  removeFromMutableArray(overlays, component)
  overlaysChanged?.()
}

export const OverlayContainer = ({ children }: PropsWithChildren) => {
  const [, setCounter] = useState(0)

  useEffect(() => {
    overlaysChanged = () => setCounter(count => count + 1)

    return () => {
      overlaysChanged = null
    }
  }, [])

  return (
    <>
      {children}
      {overlays.map((Overlay, index) => (
        <Overlay key={index} onClose={() => removeOverlay(Overlay)} />
      ))}
    </>
  )
}
