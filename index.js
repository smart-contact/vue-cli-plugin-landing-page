const fs = require('fs')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const LandingParamsPlugin = require('@smart-contact/landing-params-webpack-plugin')

module.exports = (api, options) => {
  const landingConfig = require(api.resolve('./landing.config.js'))
  const landingParams = JSON.stringify(fs.readFileSync(api.resolve('./landing-params.json')))

  //add zip plugin
  api.chainWebpack(webpackConfig => {
    //add zip plugin
    if(process.env.NODE_ENV === 'production'){
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

    //add landing-params plugin
    config
      .plugin("landing-params")
      .use(LandingParamsPlugin, [
        {
          params: landingParams
        }
      ])
      .after("html");
  })
}