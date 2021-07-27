import Vue from 'vue'
// import { LandingVuePlugin } from '@smart-contact/smartland'
import LandingVuePlugin from '@smart-contact/landing-js/vue/VueLandingPlugin.js'

Vue.use(LandingVuePlugin, window.$landingConfig)
// const { config = {}, options = {}, afterInit}
// Vue.use(LandingVuePlugin, {
//   config,
//   options,
//   plugins: [],
//   afterInit
// })