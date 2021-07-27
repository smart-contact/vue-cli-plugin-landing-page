const fs = require('fs')
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const ZipWebpackPlugin = require('zip-webpack-plugin')
const LandingParamsPlugin = require('@smart-contact/landing-params-webpack-plugin')

module.exports = (api, options) => {
  const landingConfig = require(api.resolve('./landing.config.js'))
  const landingParams = JSON.stringify(fs.readFileSync(api.resolve('./landing-params.json')))

  const buildFilenameTemplate = (ext) => `[name]-[hash:8].${ext}`

  api.chainWebpack(webpackConfig => {
    webpackConfig
      .output
        .filename(buildFilenameTemplate('js'))
        .chunkFilename(buildFilenameTemplate('js'))
        .publicPath(IS_PRODUCTION ? `https://smart-contact-cdn.livelanding.it/${landingConfig.name}` : '/')

    webpackConfig.devtool(IS_PRODUCTION ? false : 'source-map')
    
    webpackConfig
      .plugin("landing-params")
      .use(LandingParamsPlugin, [
        {
          params: landingParams
        }
      ])
      .after("html");


    //development only
    if(!IS_PRODUCTION){

    }

    //production only
    if(IS_PRODUCTION){
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