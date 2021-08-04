import Vue from "vue";
import Vuex from "vuex";
import products from '@smart-contact/smartify/src/vue/vuex-modules/products.js'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { products },
});
