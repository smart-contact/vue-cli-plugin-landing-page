const ZipWebpackPlugin = require("zip-webpack-plugin")
const LandingParamsPlugin = require("@smart-contact/landing-params-webpack-plugin")
const ImageminPlugin = require("imagemin-webpack-plugin").default

module.exports = (api, options) => {
	const landingConfig = require(api.resolve("./landing.config.js"))
	const landingParams = require(api.resolve("./landing-params.json"))

	const buildFilenameTemplate = (ext) => `[name]-[hash:8].${ext}`

	api.chainWebpack(webpackConfig => {
		webpackConfig
			.output
			.filename(buildFilenameTemplate("js"))
			.chunkFilename(buildFilenameTemplate("js"))
        
		webpackConfig.devtool("source-map")
    
		webpackConfig
			.plugin("landing-params")
			.use(LandingParamsPlugin, [
				{
					params: landingParams
				}
			])
			.after("html")


		//production only
		if(process.env.NODE_ENV === "production"){
			webpackConfig.output.publicPath = `${options.baseCdnUrl}/${landingConfig.name}` 
			
			webpackConfig.devtool(false)


			//modify images
			webpackConfig.module
				.rule("images")
				.use("url-loader")
				.tap(args => {
					args.fallback.options.name = "[name].[ext]"
					return args
				})
        
			webpackConfig.module
				.rule("svg")
				.use("file-loader")
				.tap(args => {
					args.name = "[name].[ext]"
					return args
				})

			webpackConfig.module
				.rule("media")
				.use("url-loader")
				.tap(args => {
					args.fallback.options.name = "[name].[ext]"

					return args
				})

			webpackConfig.module
				.rule("fonts")
				.use("url-loader")
				.tap(args => {
					args.fallback.options.name = "[name].[ext]"

					return args
				})

			//modify css
			webpackConfig
				.plugin("extract-css")
				.tap(args => {
					args[0].filename = buildFilenameTemplate("css")
					args[0].chunkFilename = buildFilenameTemplate("css")
					return args
				})
			
			//add images optimization
			webpackConfig
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

			webpackConfig
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