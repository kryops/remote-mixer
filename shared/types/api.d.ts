import { DeviceConfiguration } from './device'
import { RemoteMixerState } from './state'

export type RemoteMixerMode = 'iem' | 'full'

export interface ApiSyncDeviceMessage {
  type: 'sync-device'
}

export interface ApiChangeMessage {
  type: 'change'
  category: string
  id: string
  property: string
  value: any
}

export interface ApiSyncMessage {
  type: 'sync'
  state: RemoteMixerState
  device?: DeviceConfiguration
  mode: RemoteMixerMode
}

export interface ApiMetersMessage {
  type: 'meters'
  /** Partial or full state of meters */
  meters: Record<string, number>
}

export interface ApiHeartBeatMessage {
  type: 'heartbeat'
}

export type ApiInMessage = ApiChangeMessage | ApiSyncDeviceMessage
export type ApiOutMessage =
  | ApiHeartBeatMessage
  | ApiSyncMessage
  | ApiMetersMessage
  | ApiChangeMessage
