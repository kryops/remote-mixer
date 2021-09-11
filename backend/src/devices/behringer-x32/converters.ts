export function fader2Data(value: number): any {
  return { type: 'f', value: value / 255 }
}

export function data2Fader(data: unknown): number {
  if (typeof data !== 'number') return 0
  return Math.round(data * 255)
}

export function on2Data(on: boolean): any {
  return { type: 'i', value: on ? 1 : 0 }
}

export function data2On(data: unknown): boolean {
  return !!data
}

export function data2Id(data: string): string {
  return String(parseInt(data))
}

export function id2Data(id: string): string {
  return id.padStart(2, '0')
}

export interface DataConverter {
  outgoing: (value: any) => any
  incoming: (data: unknown) => any
}

export const faderConverter: DataConverter = {
  incoming: data2Fader,
  outgoing: fader2Data,
}

export const onConverter: DataConverter = {
  incoming: data2On,
  outgoing: on2Data,
}

export const nameConverter: DataConverter = {
  incoming: name => name,
  outgoing: name => name?.slice(0, 12),
}
