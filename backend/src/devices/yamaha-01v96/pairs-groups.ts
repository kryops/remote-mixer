import { delay } from '../../util/time'

import { sendMessage } from './connection'
import { message } from './message'
import { getRequestMessage } from './protocol'

const pairedChannels = new Set<string>()
const activeGroups = new Set<string>()
const channelsByGroup = new Map<string, Set<string>>()
const groupsByChannel = new Map<string, Set<string>>()

const groupTypes = ['Fader', 'Mute']

async function refreshChannels(
  channelIds: Set<string>,
  properties = ['value', 'on']
) {
  let messageCount = 0

  for (const channelId of channelIds) {
    for (const property of properties) {
      const message = getRequestMessage('ch', channelId, property)
      if (message) {
        sendMessage(message)
        messageCount++
        if (messageCount % 20 === 0) await delay(20)
      }
    }
  }
}

export async function syncPairsAndGroups(): Promise<void> {
  for (let channel = 1; channel <= 32; channel++) {
    sendMessage(
      message({
        type: 'kInputPair/kPair',
        channel: channel - 1,
        isRequest: true,
      })
    )

    for (let groupIndex = 1; groupIndex <= 8; groupIndex++) {
      for (const groupType of groupTypes) {
        sendMessage(
          message({
            type: `kInputGroup/kInGroup${groupType}${groupIndex}`,
            channel: channel - 1,
            isRequest: true,
          })
        )
      }
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
  channelId: string,
  property?: string
): Promise<void> {
  const channelsToRefresh = new Set<string>()

  // pairs
  if (pairedChannels.has(channelId)) {
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

  await refreshChannels(channelsToRefresh, property ? [property] : undefined)
}

export function updateChannelPair(channelId: string, paired: boolean): void {
  if (paired) pairedChannels.add(channelId)
  else pairedChannels.delete(channelId)
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
