const pyoner = require("@pyoner/svelte-ts-preprocess")
const { scss, postcss } = require('svelte-preprocess')
const autoprefixer = require('autoprefixer')

// For svelte-vscode
let configJs = { preprocess: pyoner.preprocess() }

// Check svelte-vscode
let isSvelteLanguageServer = false
for (let argv of process.argv) {
  if (argv.indexOf('svelte-language-server') != -1) {
    isSvelteLanguageServer = true
    break
  }
}

// If the call is by an instance, not by svelte-vscode.
if (!isSvelteLanguageServer) {
  configJs = {
    preprocess: [
      scss(),
      postcss({
        plugins: [
          autoprefixer()
        ]
      }),
      pyoner.preprocess()
    ],
    compilerOptions: {
      css: false
    }
  }
}

module.exports = configJs