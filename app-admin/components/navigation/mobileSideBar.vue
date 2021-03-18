<template>
  <div class="lg:hidden">
    <div class="fixed inset-0 flex z-40">
      <div class="fixed inset-0">
        <div class="absolute inset-0 bg-cool-gray-600 opacity-75"></div>
      </div>
      <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-100 border-r border-gray-200">
        <div class="absolute top-0 right-0 -mr-14 p-1">
          <button 
            class="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-cool-gray-600" 
            aria-label="Close sidebar"
          >
            <svg class="h-6 w-6 text-gray-900" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-shrink-0 flex items-center px-4">
          <img class="h-8 w-auto" src="~/assets/images/logo-alt.png" alt="Easywire logo">
        </div>

        <div class="mt-5 overflow-y-auto">
          <nav class="px-2 space-y-1" aria-label="mobile sidebar">
            <!-- dashboard -->
            <nuxt-link
              :to="({path: '/dashboard'})"
              class="selfcare-nav__menu"
            >
              <dashboard-icon :svgClass="'text-gray-400'" />
              Dashboard
            </nuxt-link>
  
            <!-- users -->
            <nuxt-link
              :to="({path: '/users'})"
              class="selfcare-nav__menu"
            >
              <users-icon :svgClass="'text-gray-400'" />
              Users
            </nuxt-link>
  
            <!-- forum -->
            <nuxt-link
              :to="({path: '/forum'})"
              class="selfcare-nav__menu"
            >
              <leader-board-icon :svgClass="'text-gray-400'" />
              Forum
            </nuxt-link>

            <!-- courses -->
            <nuxt-link 
              :to="({path: '/courses'})"
              class="selfcare-nav__menu"
            >
              <categories-icon :svgClass="'text-gray-400'" />
              Courses
            </nuxt-link>
          </nav>
        </div>
  
        <!-- border divider -->
        <hr class="h-px mt-6 bg-gray-200 border-none">
  
        <!-- other nav menu -->
        <div class="mt-6 flex-1 h-0 overflow-y-auto">
          <nav class="px-2 space-y-1" aria-label="nav-menu">
            <!-- settings -->
            <a 
              href="#" 
              class="selfcare-nav__menu"
            >
              <settings-icon :svgClass="'text-gray-400'"/>
              Settings
            </a>

            <!-- logout -->
            <a 
              href="#" 
              class="selfcare-nav__menu"
            >
              <logout-icon :svgClass="'text-gray-400'" />
              Logout
            </a>
          </nav>
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