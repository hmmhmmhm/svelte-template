import Bundler from 'parcel-bundler'
import path from 'path'
import tempDir from 'temp-dir'
import { serve } from './parcel.serve'

export const template = path.join(process.cwd(), './src/index.html')

export const options = {
  outDir: './dist',
  outFile: 'index.html',
  publicUrl: './',
  watch: false,
  cache: true,
  cacheDir: `${tempDir}/parcelCache`,
  minify: false,
  target: 'browser',
  https: false,
  logLevel: 3,
  hmrPort: 0,
  hmrHostname: '',
  sourceMaps: false,
  detailedReport: false
}

export const getBundler = (options) => {
  return new Bundler(template, options)
}

export const runBundle = async (options) => {
  return await getBundler(options).bundle()
}

if(process.argv[1] == __filename){
  switch(process.argv[2]){
      case '--serve':
          serve()
          break
      case '--build':
          runBundle({...options, minify: true})
          break
      case '--watch':
          runBundle({...options, watch: true})
          break
  }
}

export default options