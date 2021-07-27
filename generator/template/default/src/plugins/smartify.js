import Vue from 'vue'
import { 
  HeaderBrands,
  FeatureBox,
  // LeadModal,
  // CallMeBackFormPlugin,
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
  Vue.component(`s-${component.name}`, component)
})

//Plugins
// Vue.use(CallMeBackFormPlugin)