import { css } from '@linaria/core'
import { DeviceConfigurationCategory, FaderProperty } from '@remote-mixer/types'
import { useEffect, useMemo, useState } from 'react'

import {
  getState,
  stateEvents,
  syncEvent,
  updateIemSendSelection,
  useDeviceConfiguration,
  useIemSendSelection,
  useEffectiveRemoteMixerMode,
} from '../../api/state'
import { CategoryControl } from '../../controls/category-control'
import { Tabs } from '../containers/tabs'
import { baseline, iconShade } from '../styles'
import { hasActiveOverlays } from '../overlays/overlay'

import { CornerOverlay } from './corner-overlay'
import { showIemSendSelectorDialog } from './iem-view-selector-dialog'
import { IemSendToggle } from './iem-view-toggle'

const mainContainer = css`
  display: flex;
  height: 100%;
`

const content = css`
  flex: 1 1 auto;
  padding: ${baseline(3)};
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 800px) {
    ::-webkit-scrollbar {
      width: ${baseline()};
      background: ${iconShade(3)};
    }

    ::-webkit-scrollbar-thumb {
      background: ${iconShade(1)};
    }
  }
`

function getAvailableSends(
  categories: DeviceConfigurationCategory[]
): FaderProperty[] {
  const sends: FaderProperty[] = []
  const seenKeys = new Set<string>()
  const state = getState()

  for (const category of categories) {
    if (category.faderProperties) {
      for (const prop of category.faderProperties) {
        if (
          prop.key !== 'value' &&
          (prop.key.startsWith('aux') ||
            prop.key.startsWith('mix') ||
            prop.key.startsWith('mtx'))
        ) {
          if (!seenKeys.has(prop.key)) {
            seenKeys.add(prop.key)

            const match = prop.key.match(/^([a-z]+)(\d+)$/)
            let displayLabel = prop.label

            if (match) {
              const [, categoryKey, index] = match
              const categoryState = state.categories[categoryKey]
              if (categoryState && categoryState[index]) {
                const entry = categoryState[index]
                if (entry.name) {
                  displayLabel = entry.name
                }
              }
            }

            sends.push({
              key: prop.key,
              label: displayLabel,
            })
          }
        }
      }
    }
  }

  return sends
}

export const MainContainer = () => {
  const { categories } = useDeviceConfiguration()
  const effectiveMode = useEffectiveRemoteMixerMode()
  const iemSend = useIemSendSelection()
  const [stateVersion, setStateVersion] = useState(0)

  useEffect(() => {
    const listener = () => setStateVersion(v => v + 1)
    stateEvents.on(syncEvent, listener)
    return () => {
      stateEvents.off(syncEvent, listener)
    }
  }, [])

  const availableSends = useMemo(
    () => getAvailableSends(categories),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, stateVersion]
  )

  useEffect(() => {
    if (hasActiveOverlays()) return

    if (
      effectiveMode === 'iem' &&
      iemSend === null &&
      availableSends.length > 0
    ) {
      showIemSendSelectorDialog(availableSends, false).then(selectedSend => {
        if (selectedSend !== null) {
          updateIemSendSelection(selectedSend)
        }
      })
    }
  }, [effectiveMode, iemSend, availableSends])

  const visibleCategories = useMemo(() => {
    let filtered = categories.filter(
      category => !category.modes || category.modes.includes(effectiveMode)
    )

    if (effectiveMode === 'iem' && iemSend) {
      filtered = filtered
        .map(category => {
          if (category.faderProperties && category.faderProperties.length > 0) {
            const selectedProp = category.faderProperties.find(
              prop => prop.key === iemSend
            )

            if (selectedProp) {
              return {
                ...category,
                faderProperties: [selectedProp],
              }
            }

            return null
          }

          return category
        })
        .filter((cat): cat is DeviceConfigurationCategory => cat !== null)
    }

    return filtered
  }, [categories, effectiveMode, iemSend])

  return (
    <div className={mainContainer}>
      <div className={content}>
        <Tabs
          tabs={visibleCategories.map(category => ({
            id: category.key,
            label: category.label,
            content: <CategoryControl category={category} />,
          }))}
        />
      </div>
      <CornerOverlay />
      {effectiveMode === 'iem' && availableSends.length > 0 && (
        <IemSendToggle availableSends={availableSends} />
      )}
    </div>
  )
}
