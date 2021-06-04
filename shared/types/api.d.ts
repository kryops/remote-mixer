import { DeviceConfiguration } from './device'
import { RemoteMixerState } from './state'

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
}

export interface ApiMetersMessage {
  type: 'meters'
  /** Partial or full state of meters */
  meters: Record<string, number>
}

export type ApiInMessage = ApiChangeMessage
export type ApiOutMessage = ApiSyncMessage | ApiMetersMessage | ApiChangeMessage
