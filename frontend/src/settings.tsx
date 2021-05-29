import { css } from '@linaria/core'
import {
  useState,
  useMemo,
  PropsWithChildren,
  createContext,
  useEffect,
} from 'react'

import { getCssVariableDefinitions } from './ui/styles'

const lightTheme = css`
  ${getCssVariableDefinitions(true)}
`

export interface Settings {
  lightMode: boolean
}

export interface SettingsWithUpdate extends Settings {
  updateSettings: (settings: Partial<Settings>) => void
}

const localStorageKey = 'remoteMixerSettings'

const defaultSettings: Settings = {
  lightMode: true,
}

const initialSettings = localStorage[localStorageKey]
  ? JSON.parse(localStorage[localStorageKey])
  : defaultSettings

export const SettingsContext = createContext<SettingsWithUpdate>({
  ...initialSettings,
  updateSettings: () => {},
})

export function SettingsWrapper({ children }: PropsWithChildren<{}>) {
  const [settings, setSettings] = useState<Settings>(initialSettings)

  const { lightMode } = settings

  useEffect(() => {
    const root = document.documentElement
    if (lightMode) root.classList.add(lightTheme)
    else root.classList.remove(lightTheme)
  }, [lightMode])

  const settingsWithUpdate: SettingsWithUpdate = useMemo<SettingsWithUpdate>(
    () => ({
      ...settings,
      updateSettings: partial =>
        setSettings(prevSettings => {
          const newSettings = { ...prevSettings, ...partial }
          localStorage[localStorageKey] = JSON.stringify(newSettings)
          return newSettings
        }),
    }),
    [settings]
  )

  return (
    <SettingsContext.Provider value={settingsWithUpdate}>
      {children}
    </SettingsContext.Provider>
  )
}
