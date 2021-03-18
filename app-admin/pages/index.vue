<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-auth"
  >
    <Notification 
      :show="showNotification"
      :notificationType="notificationType"
      :message="notificationMessage"
    />
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        class="mx-auto h-16 w-auto"
        src="~/assets/images/logo.png"
        alt="Workflow"
      />
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-300">
        <div class="mb-8">
          <h2 class="mt-4 text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p class="font-normal text-base text-gray-600">
            Sign in to your account
          </p>
        </div>

        <base-form
          class="space-y-6"
          :fields="fields"
          :data="login"
          @submit.prevent="submitForm"
        >
          <!-- email field -->
          <template #email>
            <selfcare-input-label label="Email" />
            <div class="mt-1">
              <selfcare-input 
                v-model="login.email"
                :type="'email'"
              >
                <template #error> 
                  <ErrorMessage message="Email is required" />
                </template>
              </selfcare-input>
            </div>
          </template>

          <!-- password field -->
          <template #password="{ inputAttr }">
            <selfcare-input-label label="Password" />
            <div class="mt-1">
              <selfcare-input 
                v-model="login.password" 
                :type="'password'" 
                v-bind="inputAttr"
              >
                <template #error>
                  <ErrorMessage message="Password is required" />
                </template>
              </selfcare-input>
            </div>
          </template>
          <div>
            <selfcare-button button-label="sign in" />
          </div>

          <!-- forgot password -->
          <div class="flex justify-end">
            <div class="text-sm">
              <nuxt-link
                :to="{ path: '/auth/forgot-password' }"
                class="font-medium text-blue-700 hover:text-blue-500 hover:underline"
              >
                Forgot your password?
              </nuxt-link>
            </div>
          </div>
        </base-form>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import ErrorMessage from "@/components/errorMessage/ErrorMessage"
export default {
  layout: 'auth',
  components: {
    ErrorMessage
  },
  data() {
    const fields = [
      {
        name: 'email',
        validations: {
          required: () => required,
        },
      },
      {
        name: 'password',
        validations: {
          required: () => required,
        },
      },
    ]
    return {
      fields,
      login: {
        email: '',
        password: '',
      },
      showNotification: false,
      notificationType: 'success',
      notificationMessage: ""
    }
  },
  validations: {
    login: {
      email: {
        required,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    async submitForm() {
      try {
        const response = await this.$repos.auth.login(this.login)
        console.log(response)
        if(response.status === 'success') {
          this.$cookies.set('selfcare_token', response.data.token)
          this.$cookies.set('selfcare_user_id', response.data.id)
          this.notificationMessage = response.message
          this.showNotification = true
          this.$router.replace({path: 'dashboard'})
        }
      } catch (loginerror) {
        this.showNotification = true
        this.notificationType = 'error'
        this.notificationMessage = loginerror.response.data.message
      }
    },
  }
}
</script>
