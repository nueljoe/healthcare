<template>
  <div class="absolute" style="top: -20px; right: -10px;">
    <button 
      type="button"
      @click="$emit('closeModal')"
      class="flex items-center justify-center bg-white shadow-lg p-3 rounded-full focus:outline-none hover:outline-none"
    >
      <span class="sr-only">Close</span>
      
      <!-- close button -->
      <svg 
        class="h-5 w-5 text-gray-700" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        aria-hidden="true"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" d="M6 18L18 6M6 6l12 12" 
        />
      </svg>
    </button>
  </div>
</template>