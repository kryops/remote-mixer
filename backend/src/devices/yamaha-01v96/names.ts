import { DeviceMessage } from '@remote-mixer/types'
import { logger } from '@remote-mixer/utils'

import { sendMessage } from './connection'
import { character2Data, data2Character } from './converters'
import { formatMessage, message, MidiMessage } from './message'

const typePrefixByCategory: { [category: string]: string } = {
  ch: 'kInputChannelName/kChannelNameLong',
  aux: 'kAUXModuleName/kAUXModuleNameLong',
  bus: 'kBusModuleName/kBusModuleNameLong',
  sum: 'kStereoOutModuleName/kStOutModuleNameLong',
}

const categoryByPrefix = new Map<string, string>(
  Object.entries(typePrefixByCategory).map(([category, prefix]) => [
    prefix,
    category,
  ])
)

const nameCache = new Map<string, string>()

function cacheKey(category: string, id: string) {
  return category + id
}

export function handleNameMessage(message: MidiMessage): DeviceMessage | null {
  if (!message.data) return null
  if (!message.type?.includes('NameLong')) return null
  const match = message.type?.match(/^(.+)(\d+)$/)
  if (!match) return null
  const prefix = match[1]
  const index = parseInt(match[2]) - 1

  const category = categoryByPrefix.get(prefix)
  if (!category) return null

  const character = data2Character(message.data)
  const id = String(message.channel + 1)
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
  const prefix = typePrefixByCategory[category]
  if (!prefix) return

  for (let i = 1; i <= 16; i++) {
    sendMessage(
      message({
        isRequest: true,
        type: prefix + i,
        channel: parseInt(id) - 1,
      })
    )
  }
}

export function changeName(category: string, id: string, name: string): void {
  const prefix = typePrefixByCategory[category]
  if (!prefix) return

  const key = cacheKey(category, id)
  const currentCharacters = (nameCache.get(key) ?? ' '.repeat(16)).split('')

  for (let i = 0; i < 16; i++) {
    if (currentCharacters[i] === (name[i] ?? ' ')) continue
    currentCharacters[i] = name[i] ?? ' '

    const nameMessage = message({
      type: prefix + (i + 1),
      channel: parseInt(id) - 1,
      data: character2Data(currentCharacters[i]),
    })
    logger.debug(
      `==> change name ${category} ${id} =>`,
      formatMessage(nameMessage)
    )
    sendMessage(nameMessage)
  }

  nameCache.set(key, currentCharacters.join(''))
}
