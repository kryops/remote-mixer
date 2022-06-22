/**
 * Yarn >= 2 removed most lifecycle scripts: https://yarnpkg.com/advanced/lifecycle-scripts
 *
 * It still supports the postinstall script, however it does not execute it after every install;
 * it is only executed after the initial installation and if dependencies changed.
 *
 * This little plugin resurrects the behavior of Yarn classic (1.x) to execute the prepare script
 * after every installation.
 */
module.exports = {
  name: '@vlight/plugin-prepare',
  factory: require => ({
    hooks: {
      // https://yarnpkg.com/advanced/plugin-tutorial#hook-afterAllInstalled
      afterAllInstalled: async project => {
        if (process.env.PRODUCTION) return
        const yarnCore = require('@yarnpkg/core')
        console.warn('Executing prepare script...')
        // https://github.com/yarnpkg/berry/blob/%40yarnpkg/cli/3.1.0/packages/yarnpkg-core/sources/scriptUtils.ts#L522
        const statusCode = await yarnCore.scriptUtils.executeWorkspaceScript(
          project.topLevelWorkspace,
          'prepare',
          [], // args
          {} // options
        )
        if (statusCode !== 0) {
          console.error('prepare script finished with errors')
          process.exit(statusCode)
        }
      },
    },
  }),
}
