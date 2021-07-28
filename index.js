const ZipWebpackPlugin = require('zip-webpack-plugin')
const LandingParamsPlugin = require('@smart-contact/landing-params-webpack-plugin')

module.exports = (api, options) => {
  const landingConfig = require(api.resolve('./landing.config.js'))
  const landingParams = require(api.resolve('./landing-params.json'))

  const buildFilenameTemplate = (ext) => `[name]-[hash:8].${ext}`

  api.chainWebpack(webpackConfig => {
    webpackConfig
      .output
        .filename(buildFilenameTemplate('js'))
        .chunkFilename(buildFilenameTemplate('js'))
        .publicPath('/')

    webpackConfig.devtool('source-map')
    
    webpackConfig
      .plugin("landing-params")
      .use(LandingParamsPlugin, [
        {
          params: landingParams
        }
      ])
      .after("html");


    //production only
    if(process.env.NODE_ENV === 'production'){
      webpackConfig.output.publicPath(`https://smart-contact-cdn.livelanding.it/${landingConfig.name}`)
      webpackConfig.devtool(false)

      webpackConfig
        .plugin('extract-css')
        .tap(args => {
          args[0].filename = buildFilenameTemplate('css')
          args[0].chunkFilename = buildFilenameTemplate('css')
          return args
        })

      webpackConfig
        .plugin('zip-plugin')
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