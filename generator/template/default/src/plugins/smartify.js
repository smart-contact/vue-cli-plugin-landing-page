import Vue from 'vue'
import { 
  FeatureBox,
  CallMeBackForm,
  HeaderBrands,
  Footer,
  $utils
} from '@smart-contact/smartify'


//Mixins

//Components
const components = [
  HeaderBrands,
  CallMeBackForm,
  FeatureBox,
  Footer,
]
components.forEach(component => {
  Vue.component($utils.prefixComponentName(component.name), component)
})
