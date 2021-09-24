import Vue from "vue";
import { SmartlandVuePlugin } from "@smart-contact/smartland";
import SmartlandPluginSmartBridge from "@smart-contact/smartland-plugin-smart-bridge";
import SmartlandPluginScheduler from "@smart-contact/smartland-plugin-scheduler";

const { config = {}, options = {},  afterInit } = window.$landingConfig
const {  params = {},  data = {}, injection = {} } = config

const plugins = [
  [SmartlandPluginSmartBridge, injection.smartBridge || {}],
  [SmartlandPluginScheduler]
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
