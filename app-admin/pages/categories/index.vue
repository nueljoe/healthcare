<template>
  <div>
    <div class="mt-8 max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-8">
        <!-- categories table -->
        <div class="col-span-3"> 
          
        </div>

        <!-- add new category form -->
        <div class="col-span-5"> 
            
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CoursesTable from '@/components/tables/courses'
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