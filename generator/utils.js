const fs = require('fs')
module.exports = function(api){
  return {
    createYarnrcFile(){
      const registryString = '"@smart-contact:registry" "https://npm.pkg.github.com"'
      const yarnrcPath = api.resolve('./.yarnrc')

      let content = []
      if(fs.existsSync(yarnrcPath)){
        content = fs.readFileSync(yarnrcPath, 'utf-8').split(/\r?\n/g)
      }

      const alreadyInsert = content.includes(registryString)
      if(alreadyInsert){
        return
      }

      content.push(registryString)

      fs.writeFileSync(yarnrcPath, content.join('\n'))
      
    },

    // createJsConfigFile(){
    //   const configPath = api.resolve('./jsconfig.json')
    //   const config = {}

    //   fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
    // }
  }
}