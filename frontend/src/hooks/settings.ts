import { useContext } from 'react'

import { SettingsContext, SettingsWithUpdate } from '../settings'

export function useSettings(): SettingsWithUpdate {
  return useContext(SettingsContext)
}
