<template>
  <modal 
    name="category-modal" 
    :clickToClose="true"
    height="300"
    width="400"
    classes="overflow-visible"
  >
  <div class="absolute" style="bottom: 90%; left: 91%;">
    <button 
      type="button" 
      class="flex items-center justify-center bg-white shadow-lg p-3 rounded-full"
    >
      <span class="sr-only">Close</span>
      <!-- Heroicon name: outline/x -->
      <svg class="h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  </modal>
</template>


<script>
export default {
  props: {
    modalName: {
      type: String
    }
  }
}
</script>