import { ComponentType, PropsWithChildren, useSyncExternalStore } from 'react'

export interface OverlayProps {
  onClose?: () => void
}

let currentOverlays: ComponentType<OverlayProps>[] = []
let overlaysChanged: (() => void) | null = null

export function addOverlay(component: ComponentType<OverlayProps>) {
  currentOverlays = [...currentOverlays, component]
  overlaysChanged?.()
}

export function removeOverlay(component: ComponentType<OverlayProps>) {
  currentOverlays = currentOverlays.filter(it => it !== component)
  overlaysChanged?.()
}

function subscribe(callback: () => void) {
  overlaysChanged = callback
  return () => (overlaysChanged = null)
}

export const OverlayContainer = ({ children }: PropsWithChildren) => {
  const overlays = useSyncExternalStore(subscribe, () => currentOverlays)

  return (
    <>
      {children}
      {overlays.map((Overlay, index) => (
        <Overlay key={index} onClose={() => removeOverlay(Overlay)} />
      ))}
    </>
  )
}
