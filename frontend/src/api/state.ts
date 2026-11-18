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
import { useCallback, useSyncExternalStore } from 'react'

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
      void stateEvents.emit(syncEvent)
      break

    case 'meters':
      void stateEvents.emit(metersEvent)
      break

    case 'change':
      void stateEvents.emit(message.category + message.id)
      break

    case 'heartbeat':
      break // handled further up

    default:
      assertNever(message)
  }
}

function subscribeTo(event: string) {
  return (callback: () => void) => {
    stateEvents.on(event, callback)
    return () => {
      stateEvents.off(event, callback)
    }
  }
}

const subscribeToSync = subscribeTo(syncEvent)
const subscribeToIemSend = subscribeTo(iemSendEvent)
const subscribeToBypassIemMode = subscribeTo(bypassIemModeEvent)

const getDeviceConfiguration = () => deviceConfiguration
const getRemoteMixerMode = () => remoteMixerMode
const getIemSend = () => iemSendSelection
const getBypassIemMode = () => bypassIemMode

/** The state object is replaced on every sync, but not on changes. */
export function useSyncedState(): RemoteMixerState {
  return useSyncExternalStore(subscribeToSync, getState)
}

export function useDeviceConfiguration(): DeviceConfiguration {
  const configuration = useSyncExternalStore(
    subscribeToSync,
    getDeviceConfiguration
  )
  if (!configuration)
    throw new Error('deviceConfiguration accessed before it was set!')
  return configuration
}

export function useRemoteMixerMode(): RemoteMixerMode {
  return useSyncExternalStore(subscribeToSync, getRemoteMixerMode)
}

export function useDeviceCategory(key: string): DeviceConfigurationCategory {
  const category = useSyncExternalStore(subscribeToSync, () =>
    deviceConfigurationMap.get(key)
  )
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
  const subscribe = useCallback(
    (callback: () => void) => subscribeTo(eventName)(callback),
    [eventName]
  )
  return useSyncExternalStore(
    subscribe,
    () => stateManager.state.categories[category]?.[id]
  )
}

export function useIemSendSelection(): IemSendSelection | null {
  return useSyncExternalStore(subscribeToIemSend, getIemSend)
}

export function updateIemSendSelection(send: IemSendSelection): void {
  iemSendSelection = send
  setIemSendSelection(send)
  void stateEvents.emit(iemSendEvent)
}

export function useBypassIemMode(): boolean {
  return useSyncExternalStore(subscribeToBypassIemMode, getBypassIemMode)
}

export function useEffectiveRemoteMixerMode(): RemoteMixerMode {
  const mode = useRemoteMixerMode()
  const bypassIemMode = useBypassIemMode()
  return bypassIemMode ? 'full' : mode
}

export function toggleBypassIemMode(): void {
  bypassIemMode = !bypassIemMode
  void stateEvents.emit(bypassIemModeEvent)
}
