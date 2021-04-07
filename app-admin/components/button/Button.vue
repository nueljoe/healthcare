<template>
  <button
    :type="buttonType"
    class="selfcare-button"
    :class="[buttonClass, rounded ? 'rounded-md' : null ]"
    v-on="$listeners"
  >
    {{ buttonLabel }}
  </button>
</template>

<script>
export default {
  props: {
    buttonLabel: {
      type: String,
      default: () => '',
    },
    buttonType: {
      type: String,
      default: () => '',
    },
    type: {
      type: String,
      default: () => '',
    },
    buttonClass: {
      type: String,
      default: () => 'selfare-button__primary w-full',
    },
    rounded: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    buttonClicked() {
      this.$emit('buttonClicked')
    },
  },
}
</script>