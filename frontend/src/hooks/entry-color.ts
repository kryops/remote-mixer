import { StateCategoryEntry } from '@remote-mixer/types'

const pairColors = [
  '#e6194B',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#42d4f4',
  '#f032e6',
  '#bfef45',
  '#fabed4',
  '#469990',
  '#dcbeff',
  '#9A6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
]

/**
 * Returns the color for an entry: a shared pair color if the channel is paired,
 * otherwise the entry's own color.
 */
export function useEntryColor(
  id: string,
  state?: StateCategoryEntry
): string | undefined {
  if (state?.paired) {
    const pairIndex = Math.floor((parseInt(id) - 1) / 2)
    return pairColors[pairIndex % pairColors.length]
  }
  return state?.color ?? undefined
}
