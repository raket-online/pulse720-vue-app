<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
    <div class="card text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Completing authentication...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Wait a moment for Supabase to process the callback
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Initialize auth to capture the session
  await authStore.initialize()

  // Redirect to dashboard if authenticated, otherwise to login
  if (authStore.isAuthenticated) {
    router.push('/')
  } else {
    router.push('/login')
  }
})
</script>
