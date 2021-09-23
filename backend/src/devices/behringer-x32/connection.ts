import { logger } from '@remote-mixer/utils'
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
    remotePort: options.remotePort ?? 10023,
    // by default osc binds to 127.0.0.1, which is not allowed to send packets to remote hosts
    localAddress: '0.0.0.0',
  })
  port.on('message', listener)
  port.on('error', error => logger.error('OSC error', error))

  port.open()

  await new Promise<void>(resolve => {
    port.on('ready', () => {
      logger.info('OSC connection ready')
      resolve()
    })
  })

  requestUpdates()
  setInterval(requestUpdates, 9000)
}

export function sendMessage(packet: OSC.Packet): void {
  port.send(packet)
}
