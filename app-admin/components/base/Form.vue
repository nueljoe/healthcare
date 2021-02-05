<template>
  <form v-on="patchedListeners">
    <div v-for="(field, index) in fields" :key="index">
      <slot :name="field.name"></slot>
    </div>
  </form>
</template>
<script>
export default {
  props: {
    fields: {
      required: true,
      default: () => [],
    },
    // data: {
    //   required: true,
    //   default: () => {},
    // },
  },
  watch: {
    data: {
      handler(value) {
        console.log(value, this.$listeners, 'value')
        // this.$set('fieldData',)
      },
      deep: true,
    },
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
      validations: {},
      fieldData: {},
    }
  },
  methods: {
    submit(e) {
      e && e.preventDefault()
      console.log(e, 'event')
    },
  },
  mounted() {
    this.fields.forEach((element) => {
      this.validations[element.name] = element.validations
    })
  },
}
</script>