module.exports = function(api, options){
  const utils = require('./utils')(api)

  //render template
  api.render('./template/default')
  
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

  // create jsconfig.json
  utils.createJSConfig()

  //create landing.config.js & landing-params.json

  utils.createLandingConfig()
  utils.createLandingParamsJson()

  //
  api.injectImports(api.entryFile, `import "@/plugins/smartland.js"`)
  api.injectImports(api.entryFile, `import "@/plugins/smartify.js"`)
}

module.exports.hooks = api => {
  const utils = require('./utils')(api)

  api.afterInvoke(() => {
    utils.updateStylelintConfig()
  })
}