import { delay } from '../../util/time'

import { sendMessage } from './connection'
import { message } from './message'
import { getRequestMessage } from './protocol'

const pairedChannels = new Set<string>()
const activeGroups = new Set<string>()
const channelsByGroup = new Map<string, Set<string>>()
const groupsByChannel = new Map<string, Set<string>>()

const groupTypes = ['Fader', 'Mute']

function refreshChannel(
  channelId: string,
  properties = ['value', 'on'],
  alreadyRefreshed?: Set<string>
) {
  if (alreadyRefreshed?.has(channelId)) return

  for (const property of properties) {
    const message = getRequestMessage('ch', channelId, property)
    if (message) sendMessage(message)
  }

  alreadyRefreshed?.add(channelId)
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
  await delay(20)

  const refreshedChannels = new Set<string>()

  // pairs
  if (pairedChannels.has(channelId)) {
    const channelIdNumber = Number(channelId)
    const dependentChannel = String(
      channelIdNumber + (channelIdNumber % 2 === 0 ? -1 : 1)
    )
    refreshChannel(dependentChannel, undefined, refreshedChannels)
  }

  // groups
  const channelGroups = groupsByChannel.get(channelId)
  if (channelGroups?.size) {
    for (const group of channelGroups) {
      if (!activeGroups.has(group)) continue

      if (property === 'value' && !group.startsWith('Fader')) continue
      if (property === 'on' && !group.startsWith('Mute')) continue

      const groupChannels = Array.from(channelsByGroup.get(group) ?? []).filter(
        it => it !== channelId
      )
      groupChannels.forEach(it =>
        refreshChannel(it, property ? [property] : undefined, refreshedChannels)
      )

      await delay(20)
    }
  }
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
