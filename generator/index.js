module.exports = function(api, options){
	const utils = require("./utils")(api)

	//render template
	api.render("./template/default")
  
	//adding smart-contact packages + extra deps.
	utils.extendsPackages()

	utils.renderProductsStrategy(options.productsStrategy)

	// create jsconfig.json
	utils.createJSConfig()

	//create landing.config.js & landing-params.json
	const landingConfig = {
		name: api.service.pkg.name,
		cdnBaseURL: options.cdnBaseURL
	}
	utils.createLandingConfig(landingConfig)
	utils.createLandingParamsJson()
	utils.cleanProject()

	//
	api.injectImports(api.entryFile, "import \"./plugins/index\"")
	api.injectImports(api.entryFile, "import \"./plugins/smartland\"")
	api.injectImports(api.entryFile, "import \"./plugins/smartify\"")
}

module.exports.hooks = api => {
	const utils = require("./utils")(api)

	api.afterInvoke(() => {
		utils.updateStylelintConfig()
	})
}