import Vue from 'vue'
import { 
  HeaderBrands,
  FeatureBox,
  // LeadModal,
  // CallMeBackFormPlugin,
  $utils
} from '@smart-contact/smartify'


//Mixins

//Components
const components = [
  HeaderBrands,
  FeatureBox,
  // LeadModal,
  // CallMeBackFormPlugin
]
components.forEach(component => {
  Vue.component($utils.prefixComponentName(component.name), component)
})

//Plugins
// Vue.use(CallMeBackFormPlugin)