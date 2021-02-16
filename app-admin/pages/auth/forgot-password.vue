<template>
  <div 
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img 
        class="mx-auto h-16 w-auto" 
        src="~assets/images/logo.png" 
        alt="Workflow"
      />
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="mb-8">
          <h2 class="mt-6 text-2xl font-bold text-gray-800">
            Reset Your Password
          </h2>
          <p class="font-normal text-base text-gray-600">
            A password reset link will be sent to the email associated with your account.
          </p>
        </div>
        <form class="space-y-6">
          <!-- email field -->
          <div>
            <selfcare-input-label label="Email" />
            <div class="mt-1">
              <selfcare-input type="email" id="email" />
            </div>
          </div>

          <!-- submit button -->
          <div>
            <selfcare-button button-label="Send Me a link" />
          </div>

          <div class="flex items-center mt-3">
            <p class="font-medium text-gray-700 hover:text-gray-500 mb-0 pr-1">Remember your password?</p>
            <nuxt-link 
              :to="{path: '/'}"
              class="font-medium text-blue-700 hover:text-blue-500 hover:underline"
            >
              Login
            </nuxt-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth'
}
</script>