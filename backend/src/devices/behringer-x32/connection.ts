import { UDPPort, OSC } from 'osc'

export interface X32Options {
  remoteAddress: string
  remotePort: number
}

let port: UDPPort

function requestUpdates() {
  port.send({
    address: '/xremote',
    args: [],
  })
}

export async function connect(
  listener: (message: OSC.Message) => void,
  options: X32Options
): Promise<void> {
  port = new UDPPort({
    remoteAddress: options.remoteAddress,
    remotePort: options.remotePort,
  })

  port.on('message', listener)

  await new Promise<void>(resolve => {
    port.on('ready', resolve)
  })

  requestUpdates()
  setInterval(requestUpdates, 9000)
}

export function sendMessage(packet: OSC.Packet): void {
  port.send(packet)
}
