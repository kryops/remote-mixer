import { DataBytes } from './message'

/**
 * 10bit fader values are transmitted in 4 bytes
 * 00000000 00000000 00000nnn 0nnnnnnn
 */
export function fader2Data(value: unknown): DataBytes {
  if (typeof value !== 'number') return [0, 0, 0, 0]
  return [0, 0, value >> 7, value & 0x7f]
}

export function data2Fader(data: DataBytes): number {
  return (data[2] << 7) + data[3]
}

/**
 * channel on values: last byte 1/0
 */
export function on2Data(on: unknown): DataBytes {
  return [0, 0, 0, on ? 1 : 0]
}

export function data2On(data: DataBytes): boolean {
  return !!data[3]
}

/**
 * ASCII characters
 */
export function character2Data(character: unknown): DataBytes {
  if (typeof character !== 'string') return character2Data(' ')
  return [0, 0, 0, character.charCodeAt(0)]
}

export function data2Character(data: DataBytes): string {
  return String.fromCharCode(data[3])
}

export function convertMeterLevel(deviceLevel: number): number {
  // the level ranges from 0-32 (clip seems to go higher),
  // but does not seem to be linear
  return Math.min((Math.pow(deviceLevel, 2) / Math.pow(32, 2)) * 255, 255)
}

export interface DataConverter {
  outgoing: (value: any) => DataBytes
  incoming: (data: DataBytes) => any
}

export const faderConverter: DataConverter = {
  incoming: data2Fader,
  outgoing: fader2Data,
}

export const onConverter: DataConverter = {
  incoming: data2On,
  outgoing: on2Data,
}
