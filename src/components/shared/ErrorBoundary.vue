<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white shadow-lg rounded-lg p-8">
        <div
          class="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4"
        >
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-primary-600 text-center mb-2">
          Oops! Something went wrong
        </h2>

        <p class="text-gray-600 text-center mb-6">
          {{ errorMessage }}
        </p>

        <div v-if="isDev" class="bg-gray-50 rounded p-4 mb-6">
          <details>
            <summary class="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              Error Details (Development Only)
            </summary>
            <pre class="text-xs text-gray-600 overflow-auto max-h-48 mt-2">{{ errorStack }}</pre>
          </details>
        </div>

        <div class="space-y-3">
          <button @click="retry" class="w-full btn-primary">Try Again</button>

          <button @click="goHome" class="w-full btn-secondary">Go to Dashboard</button>

          <button
            v-if="isDev"
            @click="clearError"
            class="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Clear Error (Dev Only)
          </button>
        </div>
      </div>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { errorHandler, ErrorSeverity } from '@/lib/errorHandler'

const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const isDev = import.meta.env.DEV

onErrorCaptured((error: Error) => {
  // Capture error details
  hasError.value = true
  errorMessage.value = errorHandler.handleServiceError(
    error,
    'An unexpected error occurred. Please try again.'
  )
  errorStack.value = error.stack || 'No stack trace available'

  // Log to error handler
  errorHandler.captureError(error, ErrorSeverity.HIGH, {
    component: 'ErrorBoundary',
    action: 'componentError',
  })

  // Prevent error from propagating
  return false
})

function retry() {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''

  // Force re-render by navigating to same route
  router.go(0)
}

function goHome() {
  hasError.value = false
  router.push('/')
}

function clearError() {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
}
</script>
