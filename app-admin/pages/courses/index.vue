<template>
  <div>
    <div class="mt-8 max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-8">
        <!-- courses table -->
        <div class="col-span-8"> 
          <div class="flex justify-end mb-2">
            <span class="relative z-0 inline-flex shadow-sm">
              <selfcare-button 
                button-label="Create course" 
                button-class="selfare-button__light"
                :rounded="false"
                @click="$modal.show('create-course-modal')"
              />
            </span>
            <span class="relative z-0 inline-flex shadow-sm">
              <selfcare-button 
                button-label="Export" 
                button-class="selfare-button__light rounded-none"
                :rounded="false"
              />
            </span>
          </div>
          <courses-table />
        </div>
      </div>
    </div>

    <!-- modal to create course  -->
    <create-course-modal 
      modalName="create-course-modal"
    />
  </div>
</template>

<script>
  import CoursesTable from '@/components/tables/courses/coursesTable'
  import CreateCourseModal from '@/components/modals/coursesModal'
  export default {
    data() {
      return {
        croppa: {}
      }
    },
    components: {
      CoursesTable,
      CreateCourseModal
    }
  }

</script>