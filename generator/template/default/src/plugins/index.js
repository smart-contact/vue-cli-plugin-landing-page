import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import Vuelidate from 'vuelidate';
import { VueReCaptcha } from "vue-recaptcha-v3";


Vue.use(VueCompositionApi);
Vue.use(VueReCaptcha, {
  siteKey: process.env.VUE_APP_RECAPTCHA_PUBLIC_KEY,
})
Vue.use(Vuelidate);
