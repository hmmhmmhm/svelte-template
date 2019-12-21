const pyoner = require("@pyoner/svelte-ts-preprocess")
const { scss, postcss } = require('svelte-preprocess')
const autoprefixer = require('autoprefixer')

// For svelte-vscode
let configJs = { preprocess: pyoner.preprocess() }

if (process.argv[1].indexOf('--') != -1) {
  configJs = {
    preprocess: [
      scss(),
      postcss({
        plugins: [
          autoprefixer()
        ]
      }),
      pyoner.preprocess()
    ]
  }
}
module.exports = configJs