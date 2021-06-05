import { DeviceController, DeviceMessageListener } from '@remote-mixer/types'

import { connect } from './connection'
import { deviceConfig } from './device-config'

export default class Yamaha01v96DeviceController implements DeviceController {
  deviceConfig = deviceConfig

  constructor(private listener: DeviceMessageListener) {
    connect(message => {
      // TODO
    })
  }

  change(category: string, id: string, property: string, value: string): void {
    // TODO
  }
}
