<template>
  <div
    class="rounded-md p-3 absolute w-auto flex max-w-md"
    :class="[
      notificationType === 'success' ? 'bg-green-50' : null,
      notificationType === 'info' ? 'bg-blue-50' : null,
      notificationType === 'error' ? 'bg-red-50' : null,
      position === 'top-right' ? 'top-right' : null,
      position === 'top-left' ? 'top-left' : null,
      position === 'top-center' ? 'top-center' : null,
      position === 'bottom-right' ? 'bottom-right' : null,
      position === 'bottom-left' ? 'bottom-left' : null,
      position === 'bottom-center' ? 'bottom-center' : null,
    ]"
  >
    <div class="flex-shrink-0">
      <div v-if="notificationType === 'success'" class="p-1">
        <CheckIcon :svgClass="'text-green-400'" />
      </div>
    </div>
    <div class="ml-3 flex-grow p-1">
      <p
        class="text-sm font-medium leading-4"
        :class="[
          notificationType === 'success' ? 'text-green-800' : null,
          notificationType === 'info' ? 'text-blue-800' : null,
          notificationType === 'error' ? 'text-red-800' : null,
        ]"
      >
        {{ message }}
      </p>
    </div>
    <div class="ml-auto pl-3">
      <div class="-mx-1.5 -my-1.5">
        <button
          class="inline-flex rounded-md p-1 focus:outline-none"
          :class="[
            notificationType === 'success'
              ? 'bg-green-50 text-green-500 hover:bg-green-200'
              : null,
            notificationType === 'info'
              ? 'bg-blue-50 text-blue-500 hover:bg-blue-200'
              : null,
            notificationType === 'error'
              ? 'bg-red-50 text-red-500 hover:bg-red-200'
              : null,
          ]"
        >
          <span class="sr-only">Dismiss</span>
          <dismiss-icon />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DismissIcon from '@/components/vectors/DismissIcon'
import CheckIcon from '@/components/vectors/CheckIcon'
export default {
  components: {
    DismissIcon,
    CheckIcon,
  },
  props: {
    notificationType: {
      type: String,
      default: 'success',
    },
    message: {
      type: String,
      default: '',
    },
    position: {
      type: String,
      default: 'top-right',
    },
  },
}
</script>

<style>
.top-right {
  right: 5%;
  top: 5%;
}
.top-left {
  left: 5%;
  top: 5%;
}
.top-center {
  right: 50%;
  top: 5%;
  left: 50%;
  margin-left: -100px;
}
.bottom-center {
  right: 50%;
  bottom: 5%;
  left: 50%;
  margin-left: -100px;
}
.bottom-right {
  right: 5%;
  bottom: 5%;
}
.bottom-left {
  left: 5%;
  bottom: 5%;
}
</style>