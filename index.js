const { merge } = require("lodash/object")
const StylelintWebpackPlugin = require("stylelint-webpack-plugin")
const ZipWebpackPlugin = require("zip-webpack-plugin")
const LandingParamsPlugin = require("@smart-contact/landing-params-webpack-plugin")
const ImageminPlugin = require("imagemin-webpack-plugin").default
const { getLivelandingConstants } = require("./utils/constants.js")
const bootstrapSassImports = require('vue-cli-plugin-bootstrap-vue/sassAbstractsImports.js')

const scssGlobalImports = [
	// "@import \"~bootstrap/scss/_functions.scss\"", //=====================|
	// "@import \"~@/assets/scss/vendors/bootstrap-vue/_custom.scss\"", //    |
	// "@import \"~bootstrap/scss/_variables.scss\"", //                     |---> Bootstrap Vars/functions/mixins
	// "@import \"~bootstrap/scss/_mixins.scss\"", //                        |
	// "@import \"~bootstrap-vue/src/_variables.scss\"", //==================|
	...bootstrapSassImports,
	"@import \"~@smart-contact/smartify/src/scss/_functions.scss\"", //========|
	"@import \"~@/assets/scss/vendors/smartify/_custom.scss\"", //              |---> Smartify Vars/Functions/mixins
	"@import \"~@smart-contact/smartify/src/scss/_variables.scss\"", //        |
	"@import \"~@smart-contact/smartify/src/scss/mixins/index.scss\"", //====|
]

module.exports = (api, options) => {
	const landingConfig = require(api.resolve("./landing.config.js"))
	const landingParams = require(api.resolve("./landing-params.json"))

	const buildFilenameTemplate = (ext) => `[name]-[contenthash].${ext}`
	const LIVELANDING_CONSTANTS = getLivelandingConstants(landingConfig)

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

		//override svg config
		config.module.rules.delete("svg")
		config.module
			.rule("svg")
			.test(/\.svg$/)
			.use("svg")
			.loader("file-loader")
			.options({
				esModule: false,
				name: "[name].[ext]"
			})

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

		config
			.plugin("define")
			.tap(args => {
				args[0] = merge(args[0], LIVELANDING_CONSTANTS)
				return args
			})

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

			config.plugin("html")
				.tap(args => {
					args[0].minify = false
					return args
				})
				
			config
				.plugin("extract-css")
				.tap(args => {
					args[0].filename = buildFilenameTemplate("css")
					args[0].chunkFilename = buildFilenameTemplate("css")
					return args
				})
			
			// add images optimization
			config
				.plugin("image-min")
				.after("copy")
				.use(ImageminPlugin, [
					{
						test: /\.(jpe?g|png|gif|svg)$/i,
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