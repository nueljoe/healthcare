<template>
  <label 
    :for='inputFor' 
    class='selfcare-imput__label'
  >
    {{label}}
  </label>
</template>

<script>
export default {
  props: {
    inputFor: {
      type: String,
      default: () => ''
    },
    label: {
      type: String,
      default: () => ''
    }
  }
}
</script>

<style scoped>
  .selfcars_input__label {
    @apply block;
    @apply text-sm; 
    @apply font-medium;
    @apply text-gray-700;
  }
</style>