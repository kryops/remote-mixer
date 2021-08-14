import { DeviceMessage } from '@remote-mixer/types'

import { sendMessage } from './connection'
import { message, MidiMessage } from './message'

// TODO switch to message types

const nameDataType = 0x02
const parameterOffset = 4

const elementsByCategory: { [category: string]: number } = {
  ch: 0x04,
  aux: 0x10,
  bus: 0x0f,
  sum: 0x12,
}

const categoryByElement = new Map<number, string>(
  Object.entries(elementsByCategory).map(([category, element]) => [
    element,
    category,
  ])
)

const nameCache = new Map<string, string>()

function cacheKey(category: string, id: string) {
  return category + id
}

export function isNameMessage(message: MidiMessage): boolean {
  return (
    message.deviceSpecific &&
    message.dataType === nameDataType &&
    !!message.data &&
    message.parameter >= parameterOffset &&
    !!categoryByElement.get(message.element)
  )
}

export function handleNameMessage(message: MidiMessage): DeviceMessage {
  const category = categoryByElement.get(message.element)!
  const character = String.fromCharCode(message.data![3])
  const id = String(message.channel + 1)
  const index = message.parameter - parameterOffset
  const key = cacheKey(category, id)
  const entry = nameCache.get(key) ?? ' '.repeat(16)
  const newEntry = entry.slice(0, index) + character + entry.slice(index + 1)
  nameCache.set(key, newEntry)

  return {
    type: 'change',
    category,
    id,
    property: 'name',
    value: newEntry.trim(),
  }
}

export function requestName(category: string, id: string): void {
  const element = elementsByCategory[category]
  if (!element) return

  for (let i = 0; i < 16; i++) {
    sendMessage(
      message({
        isRequest: true,
        deviceSpecific: true,
        dataType: nameDataType,
        element,
        parameter: parameterOffset + i,
        channel: parseInt(id) - 1,
      })
    )
  }
}

export function changeName(category: string, id: string, name: string): void {
  const element = elementsByCategory[category]
  if (!element) return

  const key = cacheKey(category, id)
  const currentCharacters = (nameCache.get(key) ?? ' '.repeat(16)).split('')

  for (let i = 0; i < 16; i++) {
    if (currentCharacters[i] === name[i] ?? ' ') continue
    currentCharacters[i] = name[i] ?? ' '
    sendMessage(
      message({
        deviceSpecific: true,
        dataType: nameDataType,
        element,
        parameter: parameterOffset + i,
        channel: parseInt(id) - 1,
        data: [0, 0, 0, currentCharacters[i].charCodeAt(0)],
      })
    )
  }

  nameCache.set(key, currentCharacters.join(''))
}
