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

    <div class="flex sm:flex-col md:flex-row">
      <!-- course category -->
      <div class="mb-3 flex-1 md:mr-2">
        <selfcare-input-label label="Category" />
        <div class="mt-1 rounded-md shadow-sm">
          <v-select class="selfcare-input" :options="['Lifestyle', 'Learning', 'Music']"></v-select>
        </div>
      </div>

      <!-- course tags -->
      <div class="mb-3 flex-1 md:ml-2">
        <selfcare-input-label label="Tags" />
        <div class="mt-1 rounded-md shadow-sm">
          <input 
            id="tags" 
            type="text" 
            class="selfcare-input"
          >
        </div>
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

    <div class="flex sm:flex-col md:flex-row">
      <!-- course type -->
      <div class="mb-3 md:mr-2 flex-1">
        <selfcare-input-label label="Type" />
        <div class="mt-1 rounded-md shadow-sm">
          <v-select class="selfcare-input" :options="['Free', 'Paid']"></v-select>
        </div>
      </div>

      <!-- course price -->
      <div class="mb-3 flex-1 md:ml-2">
        <selfcare-input-label label="Price" />
        <div class="mt-1 rounded-md shadow-sm">
          <input 
            id="price" 
            type="text" 
            class="selfcare-input"
          >
        </div>
      </div>
    </div>

    <!-- category description -->
    <div class="mb-3">
      <selfcare-input-label label="Description" />
      <div class="mt-1 rounded-md shadow-sm">
        <textarea 
          id="description" 
          cols="1"
          rows="4"
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
          :height=150
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