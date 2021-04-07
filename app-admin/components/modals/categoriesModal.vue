<template>
  <modal 
    :name="modalName" 
    :clickToClose="true"
    height="auto"
    width="400"
    classes="overflow-visible"
  >
    <close-modal @closeModal="$modal.hide(`${modalName}`)" />
    <div class="p-5">
      <h4 class="modal-title">
        {{ actionType === 'edit' ? 'Edit' : 'Create' }} {{ categoryType }} Category
      </h4>
      <categories-form />
    </div>
  </modal>
</template>


<script>
const CloseModal = () => import('@/components/button/CloseModalButton')
const CategoriesForm = () => import('@/components/forms/category')
export default {
  props: {
    actionType: {
      type: String
    },
    categoryType: {
      type: String
    },
    modalName: {
      type: String
    }
  },
  components: {
    CategoriesForm,
    CloseModal
  }
}
</script>

<style>
  .modal-title {
    @apply text-xl;
    @apply text-gray-800;
    @apply pb-4;
    @apply capitalize;
  }
</style>