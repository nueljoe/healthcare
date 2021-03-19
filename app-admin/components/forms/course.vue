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

    <!-- course category -->
    <div class="mb-3">
      <selfcare-input-label label="Category" />
      <div class="mt-1 rounded-md shadow-sm">
        <v-select class="selfcare-input" :options="['lifestyle', 'learning', 'music']"></v-select>
      </div>
    </div>

    <!-- course tags -->
    <div class="mb-3">
      <selfcare-input-label label="Tags" />
      <div class="mt-1 rounded-md shadow-sm">
        <input 
          id="tags" 
          type="text" 
          class="selfcare-input"
        >
      </div>
    </div>

    <!-- course requirement -->
    <div class="mb-3">
      <selfcare-input-label label="Requirement" />
      <div class="mt-1 rounded-md shadow-sm">
        <input 
          id="requirement" 
          type="text" 
          class="selfcare-input"
        >
      </div>
    </div>

    <!-- category description -->
    <div class="mb-3">
      <selfcare-input-label label="Description" />
      <div class="mt-1 rounded-md shadow-sm">
        <textarea 
          id="description" 
          cols="1"
          rows="5"
          class="selfcare-input"
        >
        </textarea>
      </div>
    </div>

    <!-- ctegory image -->
    <div class="mb-3">
      <selfcare-input-label label="Banner" />
      <div class="mt-1">
        <croppa 
          v-model="croppa" 
          auto-sizing
          placeholder="choose an image"
          :placeholder-font-size="14"
          accept=".png, .jpg, image/jpeg, .JPG, .PNG, .JPEG"
          :file-size-limit="1024000"
          @file-type-mismatch="onFileTypeMismatch"
          @file-size-exceed="onFileSizeExceed"
        >
        </croppa>
      </div>
    </div>

    <div class="mt-6">
      <span class="block w-full rounded-md shadow-sm">
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
      onFileTypeMismatch (file) {
       alert('Invalid file type. Please choose a jpeg or png file.')
     },
     onFileSizeExceed (file) {
       alert('File size exceeds. Please choose a file smaller than 100kb.')
     }
    }
  }

</script>

<style>
  .croppa-container {
    background-color: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    width: 100%;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .vs__dropdown-toggle {
    border: 0 !important;
    padding: 0 !important;
  }
  .vs__selected {
    margin: 0 !important;
    padding: 0 !important;
  }
</style>