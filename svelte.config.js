const { preprocess } = require("@pyoner/svelte-ts-preprocess")
const { scss, postcss } = require('svelte-preprocess')
const autoprefixer = require('autoprefixer')

module.exports = {
  //@ts-ignore
  compiler: {
    dev: (process.argv.length > 2 && process.argv[2] == '--serve') ? true : false
  },
  preprocess: [
    scss(),
    postcss({
      plugins: [
        autoprefixer()
      ]
    }),
    preprocess()
  ]
}