const landingConfig = require("./landing.config.js")
const IS_PRODUCTION = process.env.NODE_ENV === "production"
const scssImports = [
	"@import \"~bootstrap/scss/_functions.scss\"", //=====================|
	"@import \"~@/assets/scss/vendors/bootstrap-vue/_custom.scss\"", //    |
	"@import \"~bootstrap/scss/_variables.scss\"", //                     |---> Bootstrap Vars/functions/mixins
	"@import \"~bootstrap/scss/_mixins.scss\"", //                        |
	"@import \"~bootstrap-vue/src/_variables.scss\"", //==================|
	"@import \"~@smart-contact/smartify/src/scss/_functions.scss\"", //========|
	"@import \"~@/assets/scss/vendors/smartify/_custom.scss\"", //              |---> Smartify Vars/Functions/mixins
	"@import \"~@smart-contact/smartify/src/scss/_variables.scss\"", //        |
	"@import \"~@smart-contact/smartify/src/scss/mixins/_layout.scss\"", //====|
	"@import \"~@/assets/scss/abstracts/_functions.scss\"", //==================|
	"@import \"~@/assets/scss/abstracts/_variables.scss\"", //                  |---> App vars/functions/mixins
	"@import \"~@/assets/scss/abstracts/_mixins.scss\";", //=====================|
]

module.exports = {
	configureWebpack: {
		resolve: { 
			symlinks: false
		}
	},
	productionSourceMap: false,
	outputDir: "dist",
	publicPath: IS_PRODUCTION ? `${landingConfig.cdnURL}/${landingConfig.name}` : "/",
	css: {
		loaderOptions: {
			scss: {
				additionalData: [...scssImports, ""].join(";\n")
			}
		}
	}  
}