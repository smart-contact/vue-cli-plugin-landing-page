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
import { mapState, mapActions, mapGetters } from "vuex";
// import Hero from "@/components/Hero.vue";

export default {
  name: "App",
  components: {
    // Hero,
  },

  computed: {
    ...mapState("products", { products: "items" }),
    ...mapGetters("products", [ 'buyers' ]),
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
      return {
        src: this.buyers[0].imageUrl,
        alt: `logo ${this.buyers[0].name}`,
      };
    },
  },

  methods: {
    ...mapActions("products", ["loadProducts"]),
  },

  created() {
    this.loadProducts({
      // collection: this.$landing.params.get('collection'),
      // getBuyers: false
      productIds: this.$landing.params.get("products")
    });
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";
@import "~@/assets/scss/vendors/smartify/index";
</style>
