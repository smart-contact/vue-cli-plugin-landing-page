const landingConfig = require("./landing.config.js")
const IS_PRODUCTION = process.env.NODE_ENV === "production"

module.exports = {
	configureWebpack: {
		resolve: { 
			symlinks: false
		}
	},
	productionSourceMap: false,
	outputDir: "dist",
	publicPath: IS_PRODUCTION ? `${landingConfig.cdnBaseURL}/${landingConfig.name}` : "/",
}