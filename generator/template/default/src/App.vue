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
      @show="callMeBackModalEvents.onShow"
      @hide="callMeBackModalEvents.onHide"
      :callMeBackFormOptions="callMeBackFormOptions"
      @submit="sendLead"
    />
  </div>
</template>

<script>
import { computed, onBeforeMount } from '@vue/composition-api'
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
import useCallMeBackModalEvents from '@/composables/useCallMeBackModalEvents'
import OverlayLoadingScreen from '@/components/OverlayLoadingScreen'
// import AppHero from "@/components/AppHero.vue";

export default {
  name: "App",
  components: {
    OverlayLoadingScreen,
    // AppHero,
  },

  setup(props, context){
    const { $landing } = context.root
    const lead = useLead(context, {
      disableRecaptchaCheck: !$landing.params.get('useRecaptcha')
    })
  <%_ if(!useProductsVuexModule) {_%>
    const products = useProducts()
  <%_ } _%>
    const callMeBackModalEvents = useCallMeBackModalEvents({ 
      $landing, 
    <%_ if(!useProductsVuexModule) {_%>
      selectedProduct: products.selectedProduct.value
    <%_ } _%>
    })

    const accountLogo = computed(() => {
      const { account, accountLogo, accountLogoMobile } = $landing.params.get();
      return [
        {
          src: `${LIVELANDING_CDN_IMAGES_URL}/${accountLogo}`,
          media: "(min-width: 768px)",
        },
        {
          src: `${LIVELANDING_CDN_IMAGES_URL}/${accountLogoMobile}`,
          alt: `logo ${account}`,
          media: "(max-width: 767.98px)",
          default: true,
        },
      ];
    })

    const buyerLogo = computed(() => {
    <%_ if(useProductsVuexModule) {_%>
      const [buyer] = this.buyers
    <%_ } else { _%>
      const [buyer] = this.products.buyers.value
    <%_ } _%>

      return buyer ? {
        src: buyer.imageUrl,
        alt: `logo ${buyer.name}`,
      } : {};
    })
    
    const sendLead = async (data) => {
      try{
        const successURL = $landing.params.has('successURL') && $landing.params.get('successURL')
        await lead.send(data)
        if(successURL){
          location.href = successURL
        }
      }
      catch(err){
        console.error(err)
      }
    }

    onBeforeMount(() => {
      products.load({
        // collection: this.$landing.params.get('collection'),
        // getBuyers: false
        productsIds: this.$landing.params.get("products")
      })
    })

    return {
    <%_ if(!useProductsVuexModule) {_%>
      products,
    <%_ } _%>
      lead,
      accountLogo,
      buyerLogo,
      sendLead,
      callMeBackModalEvents
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

<%_ if(useProductsVuexModule) {_%>
  computed: {
    ...mapState("products", { products: "items", buyers: "buyers" }),
  },
<%_ } _%>

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
    }
  },

<%_ if(useProductsVuexModule) {_%>
  created() {
    this.loadProducts({
      // collection: this.$landing.params.get('collection'),
      // getBuyers: false
      productsIds: this.$landing.params.get("products")
    });
  }
  <%_ } _%>
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
