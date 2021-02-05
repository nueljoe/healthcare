<template>
  <input
    :id="id"
    :name="name"
    :type="type"
    class=""
    :class="[
      type === 'checkbox'
        ? 'selfcare-input__checkbox'
        : 'placeholder-gray-400 sm:text-sm selfcare-input',
      extraClass,
    ]"
    v-on="$listeners"
  />
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: () => '',
    },
    name: {
      type: String,
      default: () => '',
    },
    type: {
      type: String,
      default: () => '',
    },
    extraClass: {
      type: String,
      default: () => '',
    },
  },
}
</script>

<style scoped>
.selfcare-input {
  @apply appearance-none;
  @apply block;
  @apply w-full;
  @apply px-3;
  @apply py-2;
  @apply border;
  @apply border-gray-300;
  @apply rounded-md;
  @apply shadow-sm;
}
.selfcare-input__checkbox {
  @apply h-4;
  @apply w-4;
  @apply text-indigo-600;
  @apply border-gray-300;
  @apply rounded;
  @apply mr-1;
}

.selfcare-input:focus {
  @apply outline-none;
  @apply border-blue-700;
}
</style>

