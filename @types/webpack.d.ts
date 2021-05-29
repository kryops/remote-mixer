// eslint-disable-next-line import/no-extraneous-dependencies
import { WebpackPluginInstance } from 'webpack'

declare module 'webpack' {
  export abstract class Plugin implements WebpackPluginInstance {
    apply: (this: Compiler, compiler: Compiler) => void
  }
}
