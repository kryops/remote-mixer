import { EventEmitter } from 'node:events'

import type ws from 'ws'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import {
  checkSockets,
  registerSocket,
  sockets,
} from '../src/services/http/websocket'

// only the socket bookkeeping is under test, not the device or state layers
vi.mock('../src/services/api', () => ({
  getApiHeartBeatMessage: () => ({ type: 'heartbeat' }),
  getSyncMessage: () => ({ type: 'sync', state: {}, mode: 'full' }),
  handleApiMessage: vi.fn(),
  isApiInMessage: () => true,
}))

// the real module would create an HTTP server
vi.mock('../src/services/http/express', () => ({ httpServer: {} }))

class MockSocket extends EventEmitter {
  ping = vi.fn()
  send = vi.fn()
  terminate = vi.fn(() => this.emit('close'))

  pong() {
    this.emit('pong')
  }
}

function connect() {
  const socket = new MockSocket()
  registerSocket(socket as unknown as ws)
  return socket
}

describe('websocket ping/pong', () => {
  beforeEach(() => {
    sockets.length = 0
  })

  it('pings connected clients', () => {
    const socket = connect()
    checkSockets()
    expect(socket.ping).toHaveBeenCalledTimes(1)
  })

  it('keeps a client that answers', () => {
    const socket = connect()
    for (let i = 0; i < 5; i++) {
      checkSockets()
      socket.pong()
    }
    expect(socket.terminate).not.toHaveBeenCalled()
    expect(sockets).toHaveLength(1)
  })

  it('tolerates a single missed pong', () => {
    const socket = connect()
    checkSockets()
    checkSockets() // first ping unanswered
    socket.pong()
    checkSockets()
    expect(socket.terminate).not.toHaveBeenCalled()
  })

  it('terminates a client after two missed pongs', () => {
    const quiet = connect()
    const alive = connect()

    checkSockets()
    alive.pong()
    checkSockets()
    alive.pong()
    checkSockets()

    expect(quiet.terminate).toHaveBeenCalledTimes(1)
    expect(alive.terminate).not.toHaveBeenCalled()
    expect(sockets).toEqual([alive])
  })
})
