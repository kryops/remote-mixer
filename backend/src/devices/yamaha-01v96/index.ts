/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DeviceController, DeviceMessageListener } from '@remote-mixer/types'

import { connect } from './connection'
import { deviceConfig } from './device-config'

export default class Yamaha01v96DeviceController implements DeviceController {
  deviceConfig = deviceConfig

  // @ts-ignore
  constructor(private listener: DeviceMessageListener) {
    // @ts-ignore
    connect(message => {
      // TODO
    })
  }

  // @ts-ignore
  change(category: string, id: string, property: string, value: string): void {
    // TODO
  }
}
