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
            Enter Your New Password
          </h2>
          <p class="font-normal text-base text-gray-600">
            Change your password by entering a new one.
          </p>
        </div>
        <form class="space-y-6">
          <!-- email field -->
          <div>
            <selfcare-input-label label="Password" inputFor="password" />
            <div class="mt-1">
              <selfcare-input type="password" id="password"/>
            </div>
          </div>

          <div>
            <selfcare-input-label label="confirm Password" inputFor="confirm-password" />
            <div class="mt-1">
              <selfcare-input type="password" id="confirm-password"/>
            </div>
          </div>

          <!-- submit button -->
          <div>
            <selfcare-button button-label="Reset Password" />
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