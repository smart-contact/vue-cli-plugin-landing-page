<template>
  <div id="app">
    <s-header-brands 
      class="py-5"
      :left-logo="buyerLogo" 
      :right-logo="accountLogo" />

  <%_ if(useProductsVuexModule) {_%>
    <b-overlay :show="products.loading" spinner-variant="primary">
  <%_ } else { _%>
    <b-overlay :show="products.loading.value" spinner-variant="primary">
  <%_ } _%>
      <template #overlay="{ spinnerVariant }">
        <div class="container">
            <overlay-loading-screen
              :logo="accountLogo[0]"
              :spinner-variant="spinnerVariant"
            />
        </div>
      </template>

      <template>
        <!-- <app-hero /> -->

        <main class="py-6">

        </main>
      </template>
    </b-overlay>
    

    <s-footer class="py-5 text-center">
      <span v-html="$landing.params.get('copyFooter')" />
    </s-footer>

    <s-call-me-back-modal id="call-me-back-modal" 
      title="Vuoi avere maggiori informazioni su questa offerta?"
      subtitle="Un consulente ti contatterà per fornirti tutte le informazioni neccessarie gratis"
      :cmb-form-loading="lead.sending.value"
      @show="onCallMeBackModalShow"
      @hide="onCallMeBackModalHide"
      :callMeBackFormOptions="callMeBackFormOptions"
      @submit="lead.send"
    />
  </div>
</template>

<script>
<%_ if(useProductsVuexModule) {_%>
import { mapState, mapActions, mapMutations } from "vuex";
import { _mutationsKeys as productsMutationsKeys } from '@smart-contact/smartify/src/vue/vuex-modules/products';
<%_ } _%>
import { 
<%_ if(!useProductsVuexModule) {_%>
  useProducts,
<%_ } _%>
  useLead
} from '@smart-contact/smartify/src/vue/composables'

import OverlayLoadingScreen from '@/components/OverlayLoadingScreen'
// import AppHero from "@/components/AppHero.vue";
const SCallMeBackModal = () => import(
    /* webpackChunkName: "call-me-back-modal" */
    '@smart-contact/smartify/src/vue/components/modals/CallMeBackModal.vue'
  );

export default {
  name: "App",
  components: {
    OverlayLoadingScreen,
    // AppHero,
    SCallMeBackModal
  },

  setup(props, context){
    const lead = useLead(context)
  <%_ if(!useProductsVuexModule) {_%>
    const products = useProducts()
  <%_ } _%>

    return {
    <%_ if(!useProductsVuexModule) {_%>
      products,
    <%_ } _%>
      lead
    }
  },

  data(){
    return {
      callMeBackFormOptions: {
        "phone-field-attrs": {
          placeholder: "Inserisci il tuo numero di cellulare",
          class: "text-center",
        },
        "submit-btn-classes": "text-uppercase",
        "submit-btn-variant": "success",
        "submit-btn-text": "Ti chiamiamo noi",
      },
    }
  },

  computed: {
  <%_ if(useProductsVuexModule) {_%>
    ...mapState("products", { products: "items", buyers: "buyers" }),
  <%_ } _%>
    accountLogo() {
      const { account, accountLogo, accountLogoMobile } = this.$landing.params.get();
      return [
        {
          src: `https://smart-contact-cdn.livelanding.it/images/${accountLogo}`,
          media: "(min-width: 768px)",
        },
        {
          src: `https://smart-contact-cdn.livelanding.it/images/${accountLogoMobile}`,
          alt: `logo ${account}`,
          media: "(max-width: 767.98px)",
          default: true,
        },
      ];
    },

    buyerLogo() {
    <%_ if(useProductsVuexModule) {_%>
      const [buyer] = this.buyers
    <%_ } else { _%>
      const [buyer] = this.products.buyers.value
    <%_ } _%>

      return buyer ? {
        src: buyer.imageUrl,
        alt: `logo ${buyer.name}`,
      } : {};
    },
  },

  methods: {
  <%_ if(useProductsVuexModule) {_%>
    ...mapMutations("products", {
      "setSelectedProductIndex": productsMutationsKeys.setSelectedItemIndex
    }),
    ...mapActions("products", ["loadProducts"]),
  <%_ } _%>
    onProductSelected({ index }) {
    <%_ if(useProductsVuexModule) {_%>
      this.setSelectedProductIndex(index);
    <%_ }else{ _%>
      this.products.setSelectedIndex(index);
    <%_ } _%>
      this.$bvModal.show("call-me-back-modal");
    },
    onCallMeBackModalShow(){
    <%_ if(!useProductsVuexModule){_%>
      if (this.products.selected.value) {
        this.$landing.data.set("offer", `${this.products.selected.value.buyer.name} - ${this.products.selected.value.name}`);
        this.$landing.data.set("buyer", this.products.selected.value.buyer.name);
      }
    <%_ } _%>
    },
    onCallMeBackModalHide(){
      this.$landing.data.restoreDefaults()
    },
  },

  created() {
  <%_ if(useProductsVuexModule) {_%>
    this.loadProducts({
      // collection: this.$landing.params.get('collection'),
      // getBuyers: false
      productsIds: this.$landing.params.get("products")
    });
  <%_ } else { _%>
    this.products.load({
       // collection: this.$landing.params.get('collection'),
      // getBuyers: false
      productsIds: this.$landing.params.get("products")
    })
  <%_ } _%>
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/vendors/smartify/index";

#app{
  .b-overlay{
    min-height: calc(100vh - #{$s-header-brands-logo-height + (spacer(5) * 2)});

    div:nth-child(2){
      width: 100%;
    }
  }
}
</style>
