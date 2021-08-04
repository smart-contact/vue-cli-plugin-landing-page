import Vue from 'vue'
import { 
  FeatureBox,
  HeaderBrands,
  Footer,
  $utils
} from '@smart-contact/smartify'


//Mixins

//Components
const components = [
  HeaderBrands,
  FeatureBox,
  Footer
]
components.forEach(component => {
  Vue.component($utils.prefixComponentName(component.name), component)
})

//Plugins
// Vue.use(CallMeBackFormPlugin)