import { StateManager } from '@remote-mixer/controls'
import {
  ApiOutMessage,
  DeviceConfiguration,
  DeviceConfigurationCategory,
  RemoteMixerMode,
  RemoteMixerState,
  StateCategoryEntry,
} from '@remote-mixer/types'
import { assertNever } from '@remote-mixer/utils'
import Emittery from 'emittery'
import { useCallback, useEffect, useState } from 'react'

import {
  IemSendSelection,
  getIemSendSelection,
  setIemSendSelection,
} from '../hooks/settings'

const stateManager = new StateManager()
let deviceConfiguration: DeviceConfiguration
const deviceConfigurationMap = new Map<string, DeviceConfigurationCategory>()
let remoteMixerMode: RemoteMixerMode = 'full'
let iemSendSelection: IemSendSelection | null = getIemSendSelection()

export const stateEvents = new Emittery()

export const metersEvent = 'meters'
export const syncEvent = 'sync'
export const iemSendEvent = 'iemSend'
export const bypassIemModeEvent = 'bypassIemMode'

let bypassIemMode =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  new URLSearchParams(window.location.search).get('bypassIemMode') === 'true'

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
      if (message.mode) {
        remoteMixerMode = message.mode
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

export function useRemoteMixerMode(): RemoteMixerMode {
  return remoteMixerMode
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

export function useIemSendSelection(): IemSendSelection | null {
  const [send, setSend] = useState<IemSendSelection | null>(iemSendSelection)

  useEffect(() => {
    const update = () => {
      setSend(iemSendSelection)
    }

    stateEvents.on(iemSendEvent, update)

    return () => {
      stateEvents.off(iemSendEvent, update)
    }
  }, [])

  return send
}

export function updateIemSendSelection(send: IemSendSelection): void {
  iemSendSelection = send
  setIemSendSelection(send)
  stateEvents.emit(iemSendEvent)
}

export function useBypassIemMode(): boolean {
  const [bypass, setBypass] = useState(bypassIemMode)

  useEffect(() => {
    const update = () => {
      setBypass(bypassIemMode)
    }

    stateEvents.on(bypassIemModeEvent, update)

    return () => {
      stateEvents.off(bypassIemModeEvent, update)
    }
  }, [])

  return bypass
}

export function useEffectiveRemoteMixerMode(): RemoteMixerMode {
  const mode = useRemoteMixerMode()
  const bypassIemMode = useBypassIemMode()
  return bypassIemMode ? 'full' : mode
}

export function toggleBypassIemMode(): void {
  bypassIemMode = !bypassIemMode
  stateEvents.emit(bypassIemModeEvent)
}
