import { join } from 'path'

import { LogLevel } from '@remote-mixer/utils'

import { isDevelopment } from './env'

export interface RemoteMixerConfiguration {
  httpPort: number
  logLevel: LogLevel | `${LogLevel}`
  device: string | { type: string; options: any }
}

export const configDirectoryPath = join(__dirname, '../../../config')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const userConfig: Partial<RemoteMixerConfiguration> = require(join(
  configDirectoryPath,
  'remote-mixer-config'
))

function c<T extends keyof RemoteMixerConfiguration>(
  key: T,
  defaultValue: RemoteMixerConfiguration[T]
): RemoteMixerConfiguration[T] {
  const userValue = userConfig[key] as RemoteMixerConfiguration[T] | undefined
  return userValue !== undefined ? userValue! : defaultValue
}

// technical config
export const httpPort = c('httpPort', 8000)
export const logLevel = c(
  'logLevel',
  isDevelopment ? LogLevel.Debug : LogLevel.Info
) as LogLevel
export const device = c('device', 'dummy')
