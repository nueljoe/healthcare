<template>
  <form v-on="patchedListeners">
    <div v-for="(field, index) in fields" :key="index">
      <slot :name="field.name"></slot>
    </div>
    <slot />
  </form>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
export default {
  props: {
    fields: {
      required: true,
      default: () => [],
    },
    data: {
      required: true,
      default: () => {},
    },
  },
  watch: {
    data: {
      handler(value) {
        Object.keys(this.validation).forEach((item) => {
          this.$set(this.fieldData, item, value[item])
        })
      },
      deep: true,
    },
  },
  validations() {
    return {
      fieldData: this.validation,
    }
  },
  computed: {
    patchedListeners() {
      const { submit, ...listeners } = this.$listeners
      return Object.assign(
        {
          submit: (e) => this.submit(e),
        },
        listeners
      )
    },
  },
  data() {
    return {
      validation: {},
      fieldData: {},
    }
  },
  methods: {
    submit(e) {
      e && e.preventDefault()
      this.$v.fieldData.$touch()
      if (this.$v.fieldData.$invalid) {
        return
      } else {
        this.$emit('submit', e)
      }
    },
  },
  mounted() {
    this.fields.forEach((item) => {
      this.validation[item.name] = { required }
    })
  },
}
</script>