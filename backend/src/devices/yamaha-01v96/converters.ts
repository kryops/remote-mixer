import { channelAuxRange } from './mapping'

export type DataBytes = [number, number, number, number]

export function isDataBytes(data: number[]): data is DataBytes {
  return data.length >= 4
}

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
 * AUX1: 0-2 (2: fader)
 * AUX2: 3-5 (5: fader)
 * ...
 */
export function channelAux2Offset(aux: number): number {
  return (aux - 1) * channelAuxRange
}

export function offset2ChannelAux(binary: number): number {
  return (binary % channelAuxRange) + 1
}
