<template>
  <div class="h-screen flex overflow-hidden bg-white">
    <TheSideBar />
    <div class="flex-1 overflow-auto focus:outline-none" tabindex="0">
      <TheTopbar />
      <main class="flex-1 relative h-auto pb-8 z-0 overflow-y-auto">
        <nuxt />
      </main>
    </div>
  </div>
</template>

<script>
import TheSideBar from '@/components/navigation/sidebar'
import TheTopbar from '@/components/navigation/topbar'
export default {
  components: {
    TheSideBar,
    TheTopbar 
  }
}
</script>

<style>
*, body, html {
  box-sizing: border-box;
}
.selfcare-input {
  @apply appearance-none;
  @apply block;
  @apply w-full;
  @apply px-3;
  @apply py-2;
  @apply border;
  @apply border-gray-300;
  @apply rounded-md;
  @apply shadow-sm;
}
.selfcare-input__checkbox {
  @apply h-4;
  @apply w-4;
  @apply text-indigo-600;
  @apply border-gray-300;
  @apply rounded;
  @apply mr-1;
}

.selfcare-input:focus {
  @apply outline-none;
  @apply border-blue-700;
}
</style>
