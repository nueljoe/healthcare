<template>
  <div class="flex items-center text-red-500 text-xs mt-2">
    <ErrorInfoIcon /> 
    <span>{{message}}</span>
  </div>
</template>
<script>
import ErrorInfoIcon from "@/components/vectors/ErrorInfo"
export default {
  components: {
    ErrorInfoIcon
  },
  props: {
    message: {
      type: String,
      default: "",
      required: true
    }
  }
}
</script>