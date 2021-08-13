<template>
  <div id="app">
    <s-header-brands 
      class="py-5"
      :left-logo="buyerLogo" 
      :right-logo="accountLogo" />
    <!-- <app-hero /> -->

    <main class="py-6">

    </main>

    <s-footer class="py-7"/>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import AppHero from "@/components/AppHero.vue";

export default {
  name: "App",
  components: {
    // AppHero,
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
@import "~@/assets/scss/vendors/smartify/index";
</style>
