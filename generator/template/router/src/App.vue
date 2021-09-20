<template>
  <div id="app">
    <s-header-brands 
      class="py-5"
      :left-logo="accountLogo" />
    
    <router-view />
      
    <s-footer class="py-5 text-center">
      <span v-html="$landing.params.get('copyFooter')" />
    </s-footer>

    <s-call-me-back-modal id="call-me-back-modal"
      :cmb-form-loading="lead.sending.value"
      @hide="onCallMeBackModalHide"
      @submit="lead.send"/>
  </div>
</template>

<script>
import { 
  useLead
} from '@smart-contact/smartify/src/vue/composables'

// import AppHero from "@/components/AppHero.vue";
const SCallMeBackModal = () => import(
    /* webpackChunkName: "call-me-back-modal" */
    '@smart-contact/smartify/src/vue/components/modals/CallMeBackModal.vue'
  );

export default {
  name: "App",
  components: {
    // AppHero,
    SCallMeBackModal
  },

  setup(props, context){
    const lead = useLead(context)

    return {    
      lead
    }
  },

  computed: {
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
  },

  methods: {
    onCallMeBackModalHide(){
      this.$landing.data.restoreDefaults()
    }
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/vendors/smartify/index";
</style>
