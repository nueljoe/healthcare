<template>
  <div class="hidden sm:block">
    <div class="flex flex-col">
      <div class="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <caption class="hidden">Courses table</caption>
          <thead>
            <tr>
              <th class="table-head" scope="row">
                Title
              </th>
              <th class="table-head" scope="row">
                Category
              </th>
              <th class="table-head" scope="row">
                Date created
              </th>
              <th class="table-head" scope="row">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="table-data">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img 
                      class="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
                      alt=""
                    >
                  </div>
                  <div class="ml-4">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      The Power of Happiness
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-data">
                <span class="inline-flex items-center px-2 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                  Learning
                </span>
              </td>
              <td class="table-data">
                12/02/2020
              </td>
              <td class="table-data">
                <div class="flex">
                  <span class="hidden sm:block shadow-sm rounded-md"><view-btn /></span>
                  <span class="hidden sm:block ml-3 shadow-sm rounded-md">
                    <edit-btn @editButtonClicked="$modal.show('edit-course-modal')" />
                  </span>
                  <span class="hidden sm:block ml-3 shadow-sm rounded-md">
                    <delete-btn @deleteButtonClicked="$modal.show('delete-course-modal')" />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <nav class="bg-white px-4 py-3 flex items-center justify-between border-t border-cool-gray-200 sm:px-6">
          <div class="hidden sm:block">
            <p class="text-sm leading-5 text-cool-gray-700">
              Showing
              <span class="font-medium">1</span>
              to
              <span class="font-medium">10</span>
              of
              <span class="font-medium">20</span>
              results
            </p>
          </div>
          <div class="flex-1 flex justify-between sm:justify-end">
            <a href="#" class="pagination-btn">Previous</a>
            <a href="#" class="ml-3 pagination-btn">Next</a>
          </div>
        </nav>
      </div>
    </div>

    <!-- edit course modal -->
    <edit-course-modal 
      modal-name="edit-course-modal"
      action-type="edit"
    />

    <!-- delete category modal -->
    <delete-course-modal 
      modalName="delete-course-modal"
      actionType="delete"
      title="Delete Course"
      sub-title= 'Are you sure you want to delete this course? All of your data will be permanently removed from our servers forever. This action cannot be undone.'
    />
  </div>
</template>

<script>
import ViewBtn from '@/components/actionIcons/view'
import EditBtn from '@/components/actionIcons/edit'
import DeleteBtn from '@/components/actionIcons/delete'
import DeleteCourseModal from '@/components/modals/confirmStatusModal'
import EditCourseModal from '@/components/modals/coursesModal'
export default {
  components: {
    ViewBtn,
    EditBtn,
    DeleteBtn,
    DeleteCourseModal,
    EditCourseModal
  }
}
</script>

<style>
</style>
