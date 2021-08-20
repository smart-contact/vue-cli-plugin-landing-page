<template functional>
  <div class="overlay-loading-screen d-flex flex-column align-items-center">
    <b-spinner :variant="props.spinnerVariant" />

    <div class="overlay-loading-screen__logo mt-4" v-if="props.logo">
      <img v-bind="props.logo">
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverlayLoadingScreen',
  props: {
    logo: {
      type: Object,
      default: null
    },
    spinnerVariant: {
      type: String,
      default: 'primary'
    }
  }
}
</script>

<style lang="scss">
.overlay-loading-screen{
  &__logo{
    max-width: 32rem;
    height: 5rem;
  }
}
</style>