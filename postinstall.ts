// @ts-ignore
const fs = require('fs')
const nodeVersion = 'node 10.11'

const exceptionList = [
    './node_modules/core-js',
    './node_modules/core-js-compat',
]

const collect = (staticPath, subPath = '/') => {
	let files = fs.readdirSync(staticPath)
	let folders = [{subPath,staticPath}]

	for(let file of files){
        let checkPath = staticPath + '/' + file
		let stats = fs.statSync(checkPath)
        if(! stats.isDirectory()) continue

        if(exceptionList.indexOf(checkPath) != -1) continue
		let collectedDatas = collect(checkPath, subPath + file + '/')

		for(let collectedData of collectedDatas)
			folders.push(collectedData)
	}

	return folders
}

const find = staticPath => {
    let folders = []

    for(let folder of collect(staticPath))
        if(fs.existsSync(folder.staticPath + `/package.json`))
            folders.push(folder.staticPath)

    return folders
}

const patch = staticPath => {
    let folders = find(staticPath)
    
    for (let folderName of folders) {
        let stats = fs.statSync(folderName)
        if (!stats.isDirectory()) continue

        try {
            let packageFilePath = `${folderName}/package.json`
            let browserListFilePath = `${folderName}/.browserslistrc`
            let packageFileData = JSON.parse(fs.readFileSync(packageFilePath))

            delete packageFileData['browserslist']
            fs.writeFileSync(browserListFilePath, nodeVersion)
            fs.writeFileSync(
                packageFilePath,
                JSON.stringify(packageFileData, null, 2)
            )
            // console.log(`Fixed browserlist in ${packageFilePath}`)
        } catch (e) {}
    }
}

patch('./node_modules')
console.log(`All browserlist has been updated.`)
