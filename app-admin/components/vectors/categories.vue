<template>
  <svg 
    :class="`${svgClass} transition ease-in-out duration-150`" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
    >
    </path>
  </svg>
</template>


<script>
export default {
  props: {
    svgClass: {
      type: String
    }
  }
}
</script>