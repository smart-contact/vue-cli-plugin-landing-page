module.exports = function(api, options){
  const utils = require('./utils')(api)

  console.log(options)
  //add registry to yarnrc file
  utils.createYarnrcFile()
  
  //adding smart-contact packages + extra deps.
  api.extendPackage({
    dependencies: {
      '@smart-contact/comparatore-api-service': '^2.x',
      '@smart-contact/smartify': '^0.x',
      // '@smart-contact/smartland': '^3.x',
      '@smart-contact/landing-js': '^2.7.x',
      '@smart-contact/validators': '^1.x',
    },
    devDependencies: {
      '@smart-contact/landing-params-webpack-plugin': '^1.x',
      'zip-webpack-plugin': '^4.x'
    }
  })

  // create jsconfig.jsona
  api.genJSConfig({
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": [
            "src/*"
        ]
      }
    }
  })

}

module.exports.hooks = api => {
  const utils = require('./utils')(api)

  api.afterInvoke(() => {
    utils.updateStylelintConfig()
    //add landing-js plugin to vue
    //add smartify

  })
}