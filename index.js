const StylelintWebpackPlugin = require("stylelint-webpack-plugin")
const ZipWebpackPlugin = require("zip-webpack-plugin")
const LandingParamsPlugin = require("@smart-contact/landing-params-webpack-plugin")
const ImageminPlugin = require("imagemin-webpack-plugin").default

module.exports = (api) => {
	const landingConfig = require(api.resolve("./landing.config.js"))
	const landingParams = require(api.resolve("./landing-params.json"))

	const buildFilenameTemplate = (ext) => `[name]-[hash:8].${ext}`

	api.chainWebpack(config => {
		config
			.output
			.filename(buildFilenameTemplate("js"))
			.chunkFilename(buildFilenameTemplate("js"))
        
		config.devtool("source-map")
    
		config
			.plugin("landing-params")
			.use(LandingParamsPlugin, [
				{
					params: landingParams
				}
			])
			.after("html")

		config
			.plugin("stylelint")
			.use(StylelintWebpackPlugin, {
				context: api.resolve("./src"),
				files: ["**/*.{vue,scss}"],
				fix: true,
			})


		//production only
		if(process.env.NODE_ENV === "production"){
			console.warn("ASSICURATI DI AVER IMPOSTATO IL publicPath SU vue.config.js")

			//config.output.publicPath('value') emits an error saying to not modify public path directly
			//this is a workaround that changes the publicPath on the service instance (acts like it was in vue.config.js)
			// api.service.projectOptions.publicPath = `${landingConfig.cdnBaseURL}/${landingConfig.name}`

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