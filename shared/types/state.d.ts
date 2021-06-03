export interface StateCategoryEntry {
  name?: string
  on?: boolean
  value?: number
  [otherProperties: string]: number
}

export type StateCategory = Record<string, StateCategoryEntry>

export interface RemoteMixerState {
  categories: Record<string, StateCategory>
  meters: Record<string, number>
}
