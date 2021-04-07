<template>
  <div class="h-screen flex overflow-hidden bg-white">
    <TheSideBar />
    <div class="flex-1 overflow-auto focus:outline-none" tabindex="0">
      <TheTopbar />
      <main class="flex-1 z-20 relative h-auto pb-8 overflow-y-auto">
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
</style>
