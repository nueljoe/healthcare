<template>
  <modal 
    :name="modalName" 
    :clickToClose="false"
    height="auto"
    :scrollable="true"
    width="650"
    classes="overflow-visible"
  >
    <div class="p-5">
    <close-modal @closeModal="$modal.hide(`${modalName}`)" />
      <h4 class="modal-title">
        {{ actionType === 'edit' ? 'Edit' : 'Create' }} Course
      </h4>
      <course-form />
    </div>
  </modal>
</template>

<script>
  const CloseModal = () => import('@/components/button/CloseModalButton');
  import CourseForm from '@/components/forms/course';
  export default {
    props: {
      actionType: {
        type: String
      },
      modalName: {
        type: String
      }
    },
    components: {
      CourseForm,
      CloseModal
    }
  }
</script>