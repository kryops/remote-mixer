import {
  useState,
  useMemo,
  PropsWithChildren,
  createContext,
  useEffect,
} from 'react'

import { lightTheme } from './ui/light-theme'

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

function loadSettings(): Settings {
  try {
    const stored = localStorage[localStorageKey]
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) }
  } catch {
    // corrupted or inaccessible storage, fall back to the defaults
  }
  return defaultSettings
}

const initialSettings = loadSettings()

export const SettingsContext = createContext<SettingsWithUpdate>({
  ...initialSettings,
  updateSettings: () => {},
})

export function SettingsWrapper({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<Settings>(initialSettings)

  const { lightMode } = settings

  useEffect(() => {
    const root = document.documentElement
    if (lightMode) root.classList.add(lightTheme)
    else root.classList.remove(lightTheme)
  }, [lightMode])

  useEffect(() => {
    localStorage[localStorageKey] = JSON.stringify(settings)
  }, [settings])

  const settingsWithUpdate: SettingsWithUpdate = useMemo<SettingsWithUpdate>(
    () => ({
      ...settings,
      updateSettings: partial =>
        setSettings(prevSettings => ({ ...prevSettings, ...partial })),
    }),
    [settings]
  )

  return (
    <SettingsContext value={settingsWithUpdate}>{children}</SettingsContext>
  )
}
