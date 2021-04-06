<template>
  <div>
    <div class="mt-8 max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-8">
        <!-- courses table -->
        <div class="col-span-5"> 
          <div class="flex justify-end mb-2">
            <span class="relative z-0 inline-flex shadow-sm rounded-md">
              <selfcare-button 
                button-label="Export" 
                button-class="selfare-button__light" 
              />
            </span>
          </div>
          <courses-table />
        </div>

        <!-- add new course form -->
        <div class="col-span-3"> 
          <div class="shadow sm:rounded-lg overflow-hidden">
            <div 
              class="
                px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium 
              text-gray-500 uppercase tracking-wider border-b border-gray-300
              "
            >
              Create course
            </div>
            <div class="bg-white w-full px-6 py-6">
              <create-course-form />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CoursesTable from '@/components/tables/courses/coursesTable'
  import CreateCourseForm from '@/components/forms/course'
  export default {
    data() {
      return {
        croppa: {}
      }
    },
    components: {
      CoursesTable,
      CreateCourseForm
    }
  }

</script>