<template>
  <modal 
    :name="modalName" 
    :clickToClose="true"
    height="auto"
    width="500"
    classes="overflow-visible"
  >
    <close-modal @closeModal="$modal.hide(`${modalName}`)" />
    <div class="inline-block align-bottom text-left overflow-hidden transform transition-all sm:my-3 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
      <div class="sm:flex sm:items-start">
        <div 
          class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
          :class="[actionType === ('delete' || 'deactivate') ? 'bg-red-100' : 'bg-green-100']"
        >
          <svg 
            class="h-6 w-6"
            :class="[actionType === ('delete' || 'deactivate') ? 'text-red-600' : 'text-green-600']"
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            {{title}}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              {{ subTitle }}
            </p>
          </div>
        </div>
      </div>

      <!-- modal footer -->
      <div class="mt-5 sm:mt-4 sm:ml-10 sm:pl-4 sm:flex">
        <button 
          type="button" 
          class="
            inline-flex justify-center w-full rounded-md border border-transparent shadow-sm 
            px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 capitalize
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm
          "
        >
          {{actionType}}
        </button>

        <!-- cansel button -->
        <selfcare-button
          button-label="Cancel" 
          button-class="selfare-button__light w-auto ml-3 inline-flex px-4 py-2" 
        />
          <!-- @click="$modal.hide(`${modalName}`)" -->
      </div>
    </div>
  </modal>
</template>


<script>
const CloseModal = () => import('@/components/button/CloseModalButton')
export default {
  props: {
    actionType: {
      type: String
    },
    modalName: {
      type: String
    },
    title: {
      type: String
    },
    subTitle: {
      type: String
    }
  },
  components: {
    // CategoriesForm,
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