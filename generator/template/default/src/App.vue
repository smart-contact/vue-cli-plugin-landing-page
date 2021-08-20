<template>
  <div id="app">
    <s-header-brands 
      class="py-5"
      :left-logo="buyerLogo" 
      :right-logo="accountLogo" />

    <b-overlay :show="products.loading" spinner-variant="primary">
      <template #overlay="{ spinnerVariant }">
        <overlay-loading-screen :logo="accountLogo" :spinner-variant="spinnerVariant" />
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

    <s-call-me-back-modal />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
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

  computed: {
    ...mapState("products", { products: "items", buyers: "buyers" }),
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
      const [buyer] = this.buyers
      return buyer ? {
        src: buyer.imageUrl,
        alt: `logo ${buyer.name}`,
      } : {};
    },
  },

  methods: {
    ...mapActions("products", ["loadProducts"]),
  },

  created() {
    this.loadProducts({
      // collection: this.$landing.params.get('collection'),
      // getBuyers: false
      productsIds: this.$landing.params.get("products")
    });
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";
@import "~@/assets/scss/vendors/smartify/index";
</style>
