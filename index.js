const { merge } = require("lodash/object")
const StylelintWebpackPlugin = require("stylelint-webpack-plugin")
const ZipWebpackPlugin = require("zip-webpack-plugin")
const LandingParamsPlugin = require("@smart-contact/landing-params-webpack-plugin")
const ImageminPlugin = require("imagemin-webpack-plugin").default

const scssGlobalImports = [
	"@import \"~bootstrap/scss/_functions.scss\"", //=====================|
	"@import \"~@/assets/scss/vendors/bootstrap-vue/_custom.scss\"", //    |
	"@import \"~bootstrap/scss/_variables.scss\"", //                     |---> Bootstrap Vars/functions/mixins
	"@import \"~bootstrap/scss/_mixins.scss\"", //                        |
	"@import \"~bootstrap-vue/src/_variables.scss\"", //==================|
	"@import \"~@smart-contact/smartify/src/scss/_functions.scss\"", //========|
	"@import \"~@/assets/scss/vendors/smartify/_custom.scss\"", //              |---> Smartify Vars/Functions/mixins
	"@import \"~@smart-contact/smartify/src/scss/_variables.scss\"", //        |
	"@import \"~@smart-contact/smartify/src/scss/mixins/index.scss\"", //====|
]

module.exports = (api, options) => {
	const landingConfig = require(api.resolve("./landing.config.js"))
	const landingParams = require(api.resolve("./landing-params.json"))

	const buildFilenameTemplate = (ext) => `[name]-[hash:8].${ext}`

	//inject all variables/functions/mixins to all vue sfc components
	options.css = merge(options.css, {
		loaderOptions: {
			sass: {
				additionalData: scssGlobalImports.join("\n")
			},
			scss: {
				additionalData: [...scssGlobalImports, ""].join(";\n")
			}
		}
	})

	api.chainWebpack(config => {
		config
			.output
			.filename(buildFilenameTemplate("js"))
			.chunkFilename(buildFilenameTemplate("js"))
        
		config.devtool("source-map")
    
		//add landing-params plugin
		config
			.plugin("landing-params")
			.use(LandingParamsPlugin, [
				{
					params: landingParams
				}
			])
			.after("html")

		//add stylelint plugin
		config
			.plugin("stylelint")
			.use(StylelintWebpackPlugin, [
				{
					context: api.resolve("./src"),
					files: ["**/*.{vue,scss}"],
					fix: true,
				}
			])


		//production only
		if(process.env.NODE_ENV === "production"){
			config.devtool(false)

			//modify images
			config.module
				.rule("images")
				.use("url-loader")
				.tap(args => {
					args.fallback.options.name = "[name].[ext]"
					return args
				})
        
			config.module
				.rule("svg")
				.use("file-loader")
				.tap(args => {
					args.name = "[name].[ext]"
					return args
				})

			config.module
				.rule("media")
				.use("url-loader")
				.tap(args => {
					args.fallback.options.name = "[name].[ext]"

					return args
				})

			config.module
				.rule("fonts")
				.use("url-loader")
				.tap(args => {
					args.fallback.options.name = "[name].[ext]"

					return args
				})

			
			//modify css
			config.module
				.rule("css")
				.use("mini-css-extract-plugin")
				.tap(args => {
					args.publicPath = options.publicPath
					return args
				})

				
			config
				.plugin("extract-css")
				.tap(args => {
					args[0].filename = buildFilenameTemplate("css")
					args[0].chunkFilename = buildFilenameTemplate("css")
					return args
				})
			
			//add images optimization
			config
				.plugin("image-min")
				.after("copy")
				.use(ImageminPlugin, [
					{
						test: /\.(jpe?g|png|gif|svg)$/i,
						jpegtran: {
							progressive: true,
							arithmetic: true
						},
						optipng: {
							optimizationLevel: 4
						},
						gifsicle: {
							optimizationLevel: 4
						},
						svgo: {}
					}
				])

			config
				.plugin("zip-plugin")
				.use(ZipWebpackPlugin, [
					{
						filename: "dist.zip",
						exclude: [/\.html$/],
						pathPrefix: landingConfig.name
					}
				])
		}
	})
}