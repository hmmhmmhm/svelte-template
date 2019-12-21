// @ts-ignore
const fs = require('fs')
const nodeVersion = 'node 10.11'

// Patch to node_modules/*
const patch = (staticPath) => {
    let folderNames = fs.readdirSync(staticPath)
    for(let folderName of folderNames){
        let stats = fs.statSync(staticPath + '/' + folderName)
        if(! stats.isDirectory()) continue

        try{
            let packageFilePath = `${staticPath}/${folderName}/package.json`
            let browserListFilePath = `${staticPath}/${folderName}/.browserslistrc`
            let packageFileData = JSON.parse(fs.readFileSync(packageFilePath))

            delete packageFileData['browserslist']
            fs.writeFileSync(browserListFilePath, nodeVersion)
            fs.writeFileSync(packageFilePath, JSON.stringify(packageFileData, null, 2))
            // console.log(`Fixed browserlist in ${packageFilePath}`)

            // Patch to node_modules/*/node_modules/*
            let nestedModulePath = `${staticPath}/${folderName}/node_modules`
            if(fs.existsSync(nestedModulePath)) patch(nestedModulePath)
        }catch(e) {}
    }
}

patch('./node_modules')
console.log(`All browserlist has been updated.`)