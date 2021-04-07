<template>
  <form>
    <!-- course title -->
    <div class="mb-3">
      <selfcare-input-label label="Title" />
      <div class="mt-1 rounded-md shadow-sm">
        <input 
          id="title" 
          type="text" 
          class="selfcare-input"
        >
      </div>
    </div>

    <!-- submit button -->
    <div class="mt-6">
      <span class="block rounded-md shadow-sm">
       <selfcare-button button-label="Create Course" />
      </span>
    </div>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        croppa: {}
      }
    },
    methods: {
    }
  }

</script>