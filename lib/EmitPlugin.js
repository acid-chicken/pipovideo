module.exports = class EmitPlugin {
  /**
   * @arg {string} file
   * @arg {string|Buffer} source
   */
  constructor(file, source) {
    this.file = file
    this.source = source
  }

  /**
   * @arg {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.thisCompilation.tap({
      name: this.constructor.name,
    }, (compilation) => {
      compilation.hooks.processAssets.tap({
        name: this.constructor.name,
        stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
      }, (assets) => {
        compilation.emitAsset(this.file, new compiler.webpack.sources.RawSource(this.source))
      })
    })
  }
}
