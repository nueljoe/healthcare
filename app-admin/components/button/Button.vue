<template>
  <button
    :type="buttonType"
    class="selfcare-button"
    :class="buttonClass"
    @click="buttonClicked"
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
      default: () => 'selfare-button__primary',
    },
  },
  methods: {
    buttonClicked() {
      this.$emit('buttonClicked')
    },
  },
}
</script>

<style scoped>
.selfcare-button {
  @apply w-full;
  @apply flex;
  @apply justify-center;
  @apply py-2;
  @apply px-4;
  @apply border-transparent;
  @apply border;
  @apply rounded-md;
  @apply shadow-sm;
  @apply text-sm;
  @apply font-medium;
}
.selfare-button__primary {
  @apply text-white;
  @apply bg-blue-700;
}

.selfare-button__primary:hover {
  @apply bg-blue-700;
}
.selfcare-button:focus {
  @apply outline-none;
}
</style>