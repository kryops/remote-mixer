export interface MidiPort {
  getPortCount(): number
  getPortName(i: number): string
  openPort(i: number): void
  closePort(): void
}

export interface MidiInputPort extends MidiPort, NodeJS.EventEmitter {
  openVirtualPort(name: string): void
  ignoreTypes(sysex: boolean, timing: boolean, activeSensing: boolean): void
  on(
    type: 'message',
    listener: (deltaTime: number, message: number[]) => void
  ): void
}

export interface MidiOutputPort extends MidiPort {
  sendMessage(message: number[]): void
}

interface MidiConstructor<T> {
  new (): T
}

interface Midi {
  Input: MidiConstructor<MidiInputPort>
  Output: MidiConstructor<MidiOutputPort>
  createReadStream(input?: MidiInputPort): NodeJS.ReadableStream
  createWriteStream(output?: MidiOutputPort): NodeJS.WritableStream
}

const midi: Midi

export = midi
