import midi, { MidiInputPort, MidiOutputPort } from 'midi'

const input = new midi.Input()
const output = new midi.Output()

function findAndOpenPort(midiPort: MidiInputPort | MidiOutputPort) {
  const portCount = midiPort.getPortCount()

  for (let i = 0; i < portCount; i++) {
    if (midiPort.getPortName(i).toLowerCase().includes('01v96')) {
      midiPort.openPort(i)
      return
    }
  }

  throw new Error('Could not connect to Yamaha 01v96. Device not found!')
}

export function connect(listener: (message: number[]) => void): void {
  findAndOpenPort(input)
  findAndOpenPort(output)
  // enable sysex, timing and active sensing
  input.ignoreTypes(false, false, false)
  input.on('message', (_, message) => listener(message))
}

export function sendMessage(message: number[]): void {
  output.sendMessage(message)
}
