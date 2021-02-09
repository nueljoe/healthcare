<template>
  <div class="hidden lg:flex lg:flex-shrink-0">
    <div class="flex flex-col w-64">
      <div class="flex flex-col flex-grow bg-blue-900 pt-5 pb-4 overflow-y-auto h-screen">
        <!-- logo -->
        <div class="flex items-center flex-shrink-0 px-4">
          <img class="h-8 w-auto" src="~/assets/images/logo.png" alt="Easywire logo">
        </div>

        <!-- main sidebar -->
        <div class="mt-6 flex-1 flex flex-col overflow-y-auto">
          <div class="overflow-y-auto">
            <nav class="px-2 space-y-1">
              <!-- dashboard -->
              <nuxt-link
                :to="({path: '/dashboard'})"
                class="selfcare-nav__menu"
              >
                <dashboard-icon />
                Dashboard
              </nuxt-link>

              <!-- users -->
              <nuxt-link
                :to="({path: '/users'})"
                class="selfcare-nav__menu"
              >
                <users-icon/>
                Users
              </nuxt-link>

              <!-- forum -->
              <nuxt-link
                :to="({path: '/forum'})"
                class="selfcare-nav__menu"
              >
                <leader-board-icon />
                Forum
              </nuxt-link>

              <!-- courses -->
              <nuxt-link 
                :to="({path: '/courses'})"
                class="selfcare-nav__menu"
              >
                <categories-icon />
                Courses
              </nuxt-link>

              <!-- questions -->
              <!-- <a 
                href="#" 
                class="selfcare-nav__menu"
              >
                <questions-icon />
                Questions
              </a> -->
            </nav>
          </div>

          <!-- border divider -->
          <hr class="h-px mt-6 bg-blue-800 border-none">
          
          <!-- other nav menu -->
          <div class="mt-6 flex-1 h-0 overflow-y-auto">
            <nav class="px-2 space-y-1">
              <!-- settings -->
              <a 
                href="#" 
                class="selfcare-nav__menu"
              >
                <settings-icon />
                Settings
              </a>

              <!-- logout -->
              <a 
                href="#" 
                class="selfcare-nav__menu"
              >
                <logout-icon />
                Logout
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const DashboardIcon = () => import('@/components/vectors/dashboard')
const UsersIcon = () => import('@/components/vectors/users')
const LeaderBoardIcon = () => import('@/components/vectors/leaderboard')
const CategoriesIcon = () => import('@/components/vectors/categories')
const QuestionsIcon = () => import('@/components/vectors/questions')
const SettingsIcon = () => import('@/components/vectors/settings')
const logoutIcon = () => import('@/components/vectors/logout')

export default {
  components: {
    DashboardIcon,
    LeaderBoardIcon,
    UsersIcon,
    CategoriesIcon,
    QuestionsIcon,
    SettingsIcon,
    logoutIcon
  }
}
</script>

<style scoped>
.selfcare-nav__menu {
  @apply flex;
  @apply items-center;
  @apply px-2;
  @apply py-2;
  @apply text-sm;
  @apply leading-6;
  @apply font-medium;
  @apply rounded-md;
  @apply text-teal-100;
  @apply transition;
  @apply ease-in-out;
  @apply duration-150;
}
.selfcare-nav__menu:hover {
  @apply text-white;
  @apply bg-blue-700;
}
.selfcare-nav__menu:hover {
  @apply text-white;
  @apply bg-blue-700;
}

.nuxt-link-active {
  @apply bg-blue-700;
  @apply text-white;
  @apply outline-none;
}
</style>