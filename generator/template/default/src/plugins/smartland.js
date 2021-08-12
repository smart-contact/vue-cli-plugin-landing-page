import Vue from "vue";
import { SmartlandVuePlugin } from "@smart-contact/smartland";
import SmartlandPluginSmartBridge from "@smart-contact/smartland-plugin-smart-bridge";

const { config = {}, options = {},  afterInit } = window.$landingConfig
const {  params = {},  data = {}, injection = {} } = config

const plugins = [
  [SmartlandPluginSmartBridge, injection.smartBridge || {}]
];

Vue.use(SmartlandVuePlugin, {
  config: {
    params,
    data
  },
  options,

  plugins,

  afterInit
});
