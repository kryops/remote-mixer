import { Socket } from 'dgram'

namespace OSC {
  interface TimeTag {
    raw: [number, number]
    native: number
  }

  interface Message {
    address: string
    args: any[]
  }

  interface Bundle {
    timeTag: TimeTag
    packets: Array<Message | Bundle>
  }

  type Packet = Message | Bundle

  interface Options {
    metadata?: boolean
    unpackSingleArgs?: boolean
  }
}

export declare class UDPPort {
  constructor(
    options: OSC.Options & {
      localPort?: number
      localAddress?: string
      remotePort?: number
      remoteAddress?: string
      broadcast?: boolean
      multicastTTL?: number
      multicastMembership?: boolean
      socket?: Socket
    }
  )

  send(packet: OSC.Packet): void
  on(event: 'ready', listener: () => void): void
  on(
    event: 'message',
    listener: (message: Message, timeTag: TimeTag, info: any) => void
  ): void
  on(
    event: 'bundle',
    listener: (message: Bundle, timeTag: TimeTag, info: any) => void
  ): void
  on(event: 'osc', listener: (packet: Packet, info: any) => void): void
  on(event: 'raw', listener: (data: Uint8Array, info: any) => void): void
  on(event: 'error', listener: (error: Error) => void): void
  open(): void
}

export declare function readPacket(
  data: Uint8Array,
  options?: OSC.Options,
  offsetState?: {
    idx: number
    length: number
  }
): OSC.Packet

export declare function writePacket(
  packet: OSC.Packet,
  options?: OSC.Options
): Uint8Array

export declare function timeTag(delay: number): OSC.TimeTag
