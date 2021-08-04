module.exports = function(api, options){
	const utils = require("./utils")(api)

	//render template
	api.render("./template/default")
  
	//adding smart-contact packages + extra deps.
	api.extendPackage({
		dependencies: {
			"@smart-contact/comparatore-api-service": "^2.4.1",
			"@smart-contact/smartify": "^0.x",
			// '@smart-contact/smartland': '^3.x',
			"@smart-contact/landing-js": "^2.7.3",
			"@smart-contact/validators": "^1.1.0",
			"vuelidate": "^0.7.x"
		},
		devDependencies: {
			"@smart-contact/landing-params-webpack-plugin": "^1.2.1",
			"stylelint": "^13.13.1",
			"stylelint-config-recommended-scss": "^4.3.0",
			"stylelint-scss": "^3.20.1",
			"stylelint-webpack-plugin": "^3.0.1",
			"zip-webpack-plugin": "^4.0.1"
		}
	})

	// create jsconfig.json
	utils.createJSConfig()

	//create landing.config.js & landing-params.json
	
	const landingConfig = {
		name: api.rootOptions.projectName,
		cdnBaseURL: options.cdnBaseURL
	}
	utils.createLandingConfig(landingConfig)
	utils.createLandingParamsJson()
	utils.cleanProject()

	//
	api.injectImports(api.entryFile, "import \"@/plugins/index.js\"")
	api.injectImports(api.entryFile, "import \"@/plugins/smartland.js\"")
	api.injectImports(api.entryFile, "import \"@/plugins/smartify.js\"")
}

module.exports.hooks = api => {
	const utils = require("./utils")(api)

	api.afterInvoke(() => {
		utils.updateStylelintConfig()
		utils.disableFontawesome()
	})
}