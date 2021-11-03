const path = require('path')
const webExt = require('web-ext')

module.exports = class WebExtPlugin {
  /**
   * @arg {Object} options
   */
  constructor(options) {
    this.options = options
  }

  /**
   * @arg {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    let extensionRunner

    compiler.hooks.afterEmit.tapPromise({
      name: this.constructor.name,
    }, async (compilation) => {
      if (compiler.watchMode) {
        if (extensionRunner) {
          await extensionRunner.reloadExtensionBySourceDir(compilation.compiler.outputPath)
        } else {
          extensionRunner = await webExt.cmd.run({
            sourceDir: compilation.compiler.outputPath,
            noReload: true,
            ...this.options,
          })

          extensionRunner.registerCleanup(() => {
            compiler.watching.close()
          })
        }
      } else {
        await webExt.cmd.build({
          sourceDir: compilation.compiler.outputPath,
          artifactsDir: path.resolve(compilation.compiler.outputPath, '..'),
          overwriteDest: true,
          ...this.options,
        })
      }
    })

    compiler.hooks.watchClose.tap({
      name: this.constructor.name,
    }, () => {
      void extensionRunner?.exit()
    })
  }
}
