<template>
  <div class="hidden sm:block">
    <div class="flex flex-col">
      <div class="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <caption class="hidden">{{categoryType === 'course' ? 'Course categories' : 'product categories'}}</caption>
          <thead>
            <tr>
              <th class="table-head" scope="row">
                s/n
              </th>
              <th class="table-head" scope="row">
                Title
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
                1
              </td>
              <td class="table-data">
                <div class="text-sm leading-5 font-medium text-gray-900">
                  The Power of Happiness
                </div>
              </td>
              <td class="table-data">
                12/02/2020
              </td>
              <td class="table-data">
                <div class="flex">
                  <span class="hidden sm:block ml-3 shadow-sm rounded-md">
                    <edit-btn @editButtonClicked="$modal.show('edit-category-modal')" />
                  </span>
                  <span class="hidden sm:block ml-3 shadow-sm rounded-md">
                    <delete-btn @deleteButtonClicked="$modal.show('delete-category-modal')" />
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

    <!-- create and edit category modal -->
    <categories-modal 
      actionType="edit" 
      :categoryType="categoryType" 
      modalName="edit-category-modal"
    />

    <!-- delete category modal -->
    <delete-category-modal 
      modalName="delete-category-modal"
      actionType="delete"
      title="Delete Category"
      sub-title= 'Are you sure you want to deactivate your account? All of your data will be permanently removed from our servers forever. This action cannot be undone.'
    />
  </div>
</template>

<script>
import EditBtn from '@/components/actionIcons/edit'
import DeleteBtn from '@/components/actionIcons/delete'
import CategoriesModal from '@/components/modals/categoriesModal'
import DeleteCategoryModal from '@/components/modals/confirmStatusModal'
export default {
  components: {
    EditBtn,
    DeleteBtn,
    CategoriesModal,
    DeleteCategoryModal
  },
  props: {
    categoryType: {
      type: String
    },
    action: {
      type: String
    }
  }
}
</script>
