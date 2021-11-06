const routerGenerator = require("@vue/cli-plugin-router/generator")
const vuexGenerator = require("@vue/cli-plugin-vuex/generator")

module.exports = function(api, options){
	const utils = require("./utils")(api)

	//adding smart-contact packages + extra deps.
	api.extendPackage({
		dependencies: {
			"@smart-contact/comparatore-api-service": "^2.6.x",
			"@smart-contact/smartify": "^0.x",
			"@smart-contact/smartland": "^3.1.x",
			"@smart-contact/smartland-plugin-smart-bridge": "^1.x",
			"@smart-contact/smartland-plugin-scheduler": "^1.x",
			"@smart-contact/validators": "^1.1.0",
			"@vue/composition-api": "^1.2.x",
			"vue-recaptcha-v3": "^1.9.0",
			"vuelidate": "^0.7.x"
		},
		devDependencies: {
			"@smart-contact/landing-params-webpack-plugin": "^1.3.0",
			"stylelint": "^13.13.1",
			"stylelint-config-recommended-scss": "^4.3.0",
			"stylelint-scss": "^3.20.1",
			"stylelint-webpack-plugin": "^3.0.1",
			"zip-webpack-plugin": "^4.0.1"
		}
	})

	//execute router generator
	if(options.useRouter){
		routerGenerator(api, {
			historyMode: false
		})
	}

	//execute vuex generator
	if(options.useVuex){
		vuexGenerator(api)
	}

	api.render("./template/default", {
		useProductsVuexModule: options.useProductsVuexModule
	})

	if(options.useRouter){
		api.render("./template/router")
	}
	
	api.onCreateComplete(async () => {

		utils.cleanProject()
		utils.updateBrowserlist()
		utils.createStylelintConfig()
		utils.updateEslintConfig()
		//create landing.config.js & landing-params.json
		const landingConfig = {
			name: api.rootOptions.projectName,
			cdnBaseURL: options.cdnBaseURL
		}
		utils.createLandingConfig(landingConfig)
		utils.injectImports()
	})
	
}
