// @ts-ignore
const fs = require('fs')

const getExtension = fileName => {
    let extensionArr = fileName.split('.')
    return extensionArr[extensionArr.length - 1]
}

const postBuild = targetPath => {
    let fileNames = fs.readdirSync(targetPath)
    // console.log(targetPath, files)

    let scripts = []
    let resources = []

    let resourceExts = ['css', 'png', 'jpg', 'jpeg', 'gif']

    // Collection and Classification
    for (let fileName of fileNames) {
        // console.log(fileName)
        if (getExtension(fileName) == 'js') scripts.push(fileName)
        else {
            for (let resourceExt of resourceExts) {
                if (getExtension(fileName) == resourceExt) {
                    resources.push(fileName)
                    break
                }
            }
        }
    }

    // Exclude targets already scheduled to load
    let indexHtmlPath = targetPath + '/index.html'
    let indexHtml = fs.readFileSync(indexHtmlPath)
    let needToPrefetchScripts = []
    let needToPrefetchResources = []
    for (let script of scripts) {
        let isExistInIndexHtml = String(indexHtml).indexOf(script) != -1
        if (!isExistInIndexHtml) needToPrefetchScripts.push(script)
    }
    for (let resource of resources) {
        let isExistInIndexHtml = String(indexHtml).indexOf(resource) != -1
        if (!isExistInIndexHtml) needToPrefetchResources.push(resource)
    }
    //console.log('scripts:', needToPrefetchScripts)
    //console.log('resources:', needToPrefetchResources)
    //console.log('origina HTML', indexHtml)

    // Create Prefetch Inejct Code
    let injectPrefetchList = ''
    for (let needToPrefetchScript of needToPrefetchScripts)
        injectPrefetchList += `<link rel="prefetch" href="${needToPrefetchScript}">`
    for (let needToPrefetchResource of needToPrefetchResources)
        injectPrefetchList += `<link rel="prefetch" href="${needToPrefetchResource}">`

    let changedHtml = String(indexHtml).replace(
        '</head>',
        injectPrefetchList + '</head>'
    )
    fs.writeFileSync(indexHtmlPath, changedHtml)
    console.log(
        `${needToPrefetchScripts.length +
            needToPrefetchResources.length}'s prefetch registrations completed.`
    )
}

// @ts-ignore
const targetPath = String(process.argv[2])

// @ts-ignore
if (process.argv[1].indexOf('postbuild.ts') !== -1 && targetPath.length != 0)
    postBuild(targetPath)

// @ts-ignore
module.exports = postBuild
