import Emittery from 'emittery'
import { StateManager } from '@remote-mixer/controls'
import {
  ApiOutMessage,
  DeviceConfiguration,
  DeviceConfigurationCategory,
  RemoteMixerState,
  StateCategoryEntry,
} from '@remote-mixer/types'
import { useCallback, useEffect, useState } from 'react'
import { assertNever } from '@remote-mixer/utils'

const stateManager = new StateManager()
let deviceConfiguration: DeviceConfiguration
const deviceConfigurationMap = new Map<string, DeviceConfigurationCategory>()

export const stateEvents = new Emittery()

export const metersEvent = 'meters'
export const syncEvent = 'sync'

export function getState(): RemoteMixerState {
  return stateManager.state
}

export function handleApiMessage(message: ApiOutMessage): void {
  stateManager.handleMessage(message)

  switch (message.type) {
    case 'sync':
      if (message.device) {
        deviceConfiguration = message.device
        deviceConfigurationMap.clear()
        message.device.categories.forEach(category =>
          deviceConfigurationMap.set(category.key, category)
        )
      }
      stateEvents.emit(syncEvent)
      break

    case 'meters':
      stateEvents.emit(metersEvent)
      break

    case 'change':
      stateEvents.emit(message.category + message.id)
      break

    case 'heartbeat':
      break // handled further up

    default:
      assertNever(message)
  }
}

export function useDeviceConfiguration(): DeviceConfiguration {
  if (!deviceConfiguration)
    throw new Error('deviceConfiguration accessed before it was set!')
  return deviceConfiguration
}

export function useDeviceCategory(key: string): DeviceConfigurationCategory {
  const category = deviceConfigurationMap.get(key)
  if (!category)
    throw new Error(
      'deviceConfiguration accessed before it was set or category not defined!'
    )
  return category
}

export function useEntryState(
  category: string,
  id: string
): StateCategoryEntry | undefined {
  const eventName = category + id
  const selector = useCallback(
    () => stateManager.state.categories[category]?.[id],
    [category, id]
  )
  const [state, setState] = useState(selector)

  useEffect(() => {
    setState(selector())
  }, [selector])

  useEffect(() => {
    const update = () => {
      setState(selector())
    }

    stateEvents.on(eventName, update)

    return () => {
      stateEvents.off(eventName, update)
    }
  }, [eventName, selector])

  return state
}
