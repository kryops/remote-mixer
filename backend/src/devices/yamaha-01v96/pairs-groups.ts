import { delay } from '../../util/time'

import { sendMessage } from './connection'
import { message } from './message'
import { getRequestMessage } from './protocol'

const pairedChannels = new Map<string, Set<string>>()
const activeGroups = new Set<string>()
const channelsByGroup = new Map<string, Set<string>>()
const groupsByChannel = new Map<string, Set<string>>()

const groupTypes = ['Fader', 'Mute']

async function refreshChannels(
  category: string,
  channelIds: Set<string>,
  properties = ['value', 'on']
) {
  let messageCount = 0

  for (const channelId of channelIds) {
    for (const property of properties) {
      const message = getRequestMessage(category, channelId, property)
      if (message) {
        sendMessage(message)
        messageCount++
        if (messageCount % 20 === 0) await delay(20)
      }
    }
  }
}

export async function syncPairsAndGroups(): Promise<void> {
  const categories = {
    kInputPair: 32,
    kBusPair: 8,
    kAUXPair: 8,
  }

  for (const [category, count] of Object.entries(categories)) {
    for (let channel = 1; channel <= count; channel++) {
      sendMessage(
        message({
          type: `${category}/kPair`,
          channel: channel - 1,
          isRequest: true,
        })
      )
    }

    await delay(20)
  }

  // group: active
  for (let groupIndex = 1; groupIndex <= 8; groupIndex++) {
    for (const groupType of groupTypes) {
      sendMessage(
        message({
          type: `kSceneInputGroup/kIn${groupType}Group${groupIndex}`,
          channel: 0,
          isRequest: true,
        })
      )
    }
  }
}

export async function refreshDependentChannels(
  category: string,
  channelId: string,
  property?: string
): Promise<void> {
  const channelsToRefresh = new Set<string>()

  // pairs
  if (pairedChannels.get(category)?.has(channelId)) {
    const channelIdNumber = Number(channelId)
    const dependentChannel = String(
      channelIdNumber + (channelIdNumber % 2 === 0 ? -1 : 1)
    )
    channelsToRefresh.add(dependentChannel)
  }

  // groups
  const channelGroups = groupsByChannel.get(channelId)
  if (channelGroups?.size) {
    for (const group of channelGroups) {
      if (!activeGroups.has(group)) continue

      if (property === 'value' && !group.startsWith('Fader')) continue
      if (property === 'on' && !group.startsWith('Mute')) continue

      channelsByGroup.get(group)?.forEach(it => {
        if (it !== channelId) channelsToRefresh.add(it)
      })
    }
  }

  if (!channelsToRefresh.size) return

  await delay(20)

  await refreshChannels(
    category,
    channelsToRefresh,
    property ? [property] : undefined
  )
}

export function updateChannelPair(
  category: string,
  channelId: string,
  paired: boolean
): void {
  if (!pairedChannels.has(category)) pairedChannels.set(category, new Set())
  if (paired) pairedChannels.get(category)!.add(channelId)
  else pairedChannels.get(category)!.delete(channelId)
}

export function updateGroupActive(group: string, active: boolean): void {
  if (active) activeGroups.add(group)
  else activeGroups.delete(group)
}

export function updateGroupChannelMembership(
  group: string,
  channelId: string,
  member: boolean
): void {
  if (!groupsByChannel.has(channelId)) groupsByChannel.set(channelId, new Set())
  if (!channelsByGroup.has(group)) channelsByGroup.set(group, new Set())

  if (member) {
    groupsByChannel.get(channelId)!.add(group)
    channelsByGroup.get(group)!.add(channelId)
  } else {
    groupsByChannel.get(channelId)!.delete(group)
    channelsByGroup.get(group)!.delete(channelId)
  }
}
