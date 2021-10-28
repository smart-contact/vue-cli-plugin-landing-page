import Vue from 'vue'
import { 
  FeatureBox,
  CallMeBackForm,
  HeaderBrands,
  Footer,
  CallMeBackModal,
  $utils
} from '@smart-contact/smartify'


//Mixins

//Components
const components = [
  HeaderBrands,
  CallMeBackForm,
  FeatureBox,
  Footer,
  CallMeBackModal
]
components.forEach(component => {
  Vue.component($utils.prefixComponentName(component.name), component)
})
