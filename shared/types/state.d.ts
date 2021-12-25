export interface StateCategoryEntry {
  name?: string
  on?: boolean
  value?: number
  color?: string | null
  [otherProperties: string]: number
}

export type StateCategory = Record<string, StateCategoryEntry>

export interface RemoteMixerState {
  categories: Record<string, StateCategory>
  meters: Record<string, number>
}
