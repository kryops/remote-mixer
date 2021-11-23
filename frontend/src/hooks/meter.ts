import { DeviceConfigurationCategory } from '@remote-mixer/types'
import React, { useEffect, useRef } from 'react'

import { getState, metersEvent, stateEvents } from '../api/state'

export function useMeter(
  category: DeviceConfigurationCategory,
  id: string
): React.RefObject<HTMLDivElement> | undefined {
  const meterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!category.meters) return () => {}

    let oldValue: number

    const updateMeter = () => {
      if (!meterRef.current) return
      const value = getState().meters[category.key + id]
      if (value !== oldValue && value !== undefined) {
        oldValue = value
        const sanitizedValue = Math.max(Math.min(value / 255, 1), 0)
        meterRef.current.style.transform = `scaleY(${sanitizedValue})`
      }
    }

    updateMeter()

    stateEvents.on(metersEvent, updateMeter)

    return () => {
      stateEvents.off(metersEvent, updateMeter)
    }
  }, [category, id])

  return category.meters ? meterRef : undefined
}
