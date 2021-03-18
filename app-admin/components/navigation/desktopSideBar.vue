<template>
  <div class="hidden lg:flex lg:flex-shrink-0">
    <div class="flex flex-col w-64">
      <div class="flex flex-col flex-grow bg-gray-100 pt-5 border-r border-gray-200 pb-4 overflow-y-auto h-screen">
        <!-- logo -->
        <div class="flex items-center flex-shrink-0 px-4">
          <img 
            class="h-8 w-auto" 
            src="~/assets/images/logo-alt.png" 
            alt="Selfcare learning"
          >
        </div>

        <!-- main sidebar -->
        <div class="mt-6 flex-1 flex flex-col overflow-y-auto">
          <div class="overflow-y-auto">
            <nav class="px-2 space-y-1" aria-label="desktop sidebar">
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

<style>
.selfcare-nav__menu {
  @apply flex;
  @apply items-center;
  @apply px-2;
  @apply py-2;
  @apply text-sm;
  @apply leading-6;
  @apply font-medium;
  @apply rounded-md;
  @apply text-gray-700;
  @apply transition;
  @apply ease-in-out;
  @apply duration-150;
}

.selfcare-nav__menu:hover {
  @apply text-gray-900;
  @apply bg-gray-200;
}

.nuxt-link-active {
  @apply bg-gray-200;
  @apply text-gray-900;
  @apply outline-none;
}

.selfcare-nav__menu:hover svg,
 .nuxt-link-active svg {
  @apply text-gray-500;
}
</style>