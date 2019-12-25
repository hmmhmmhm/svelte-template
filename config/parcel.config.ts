import Bundler from 'parcel-bundler'
import path from 'path'
import { serve } from './parcel.serve'
import SveltePlugin from 'parcel-plugin-svelte'

export const template = path.join(process.cwd(), './src/index.html')

export const options = {
    outDir: './dist',
    outFile: 'index.html',
    publicUrl: './',
    watch: false,
    cache: true,
    minify: false,
    target: 'browser',
    https: false,
    logLevel: 3,
    hmrPort: 0,
    production: false,
    hmrHostname: '',
    sourceMaps: false,
    detailedReport: true,
}

export const getBundler = async options => {
    let bundler = new Bundler(template, options)
    await SveltePlugin(bundler)
    return bundler
}

export const runBundle = async options => {
    let bundler = await getBundler(options)
    return await bundler.bundle()
}

if (process.argv[1] == __filename) {
    switch (process.argv[2]) {
        case '--serve':
            serve()
            break
        case '--watch':
            runBundle({ ...options, production: true, watch: true })
            break
        case '--build':
            runBundle({
                ...options,
                production: true,
                minify: true,
                hmr: false,
            })
            break
        case '--product-build':
            runBundle({
                ...options,
                production: true,
                minify: true,
                outDir: './production',
                hmr: false,
            })
            break
        case '--product-serve':
            serve({ isProductMode: true })
            break
    }
}

export default options
