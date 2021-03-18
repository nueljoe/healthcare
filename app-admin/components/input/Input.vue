<template>
  <div>
    <input
      :class="[
        type === 'checkbox'
          ? 'selfcare-input__checkbox'
          : 'placeholder-gray-400 sm:text-sm selfcare-input',
        extraClass,
      ]"
      v-on="patchedListeners"
      v-bind="patchedAttrs"
      :type="type"
    />
    <slot name="error" v-if="$v.tmpValue.$error" />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  inheritAttrs: false,
  props: {
    value: { default: null },
    id: {
      type: String,
      default: () => '',
    },
    event: { type: String, default: 'input' },
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
  validations: {
    tmpValue: {
      required,
    },
  },
  data() {
    return {
      tmpValue: '',
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.tempValue = value
      },
    },
  },
  computed: {
    patchedListeners() {
      const { blur, ...listeners } = { ...this.$listeners }
      listeners[this.event] = ($event) => {
        this.setValue($event instanceof Event ? $event.target.value : $event)
      }
      return Object.assign(listeners, {
        blur: () => this.validateField(),
      })
    },
    patchedAttrs() {
      const attr = this.$attrs
      return Object.assign(attr, {
        value: this.tmpValue,
      })
    },
  },
  methods: {
    setValue(value) {
      this.tmpValue = value
      this.$emit(this.event, value)
    },
    validateField() {
      this.$v.tmpValue.$touch()
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

