<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Pulse720</h1>
            <p class="text-sm text-gray-600">AI-Powered Content Management</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">{{ authStore.user?.email }}</span>
            <button
              @click="handleLogout"
              class="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Pillars Tab -->
          <div v-if="activeTab === 'pillars'">
            <div class="text-center py-12">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Content Pillars</h2>
              <p class="text-gray-600 mb-6">
                Create and manage your content pillars to organize your marketing strategy.
              </p>
              <button class="btn-primary">
                Create Your First Pillar
              </button>
            </div>
          </div>

          <!-- Studio Tab -->
          <div v-if="activeTab === 'studio'">
            <div class="text-center py-12">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Studio</h2>
              <p class="text-gray-600">
                Select a pillar to start creating content.
              </p>
            </div>
          </div>

          <!-- Content Tab -->
          <div v-if="activeTab === 'content'">
            <div class="text-center py-12">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Content Library</h2>
              <p class="text-gray-600">
                View and manage all your generated content.
              </p>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'">
            <div class="text-center py-12">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
              <p class="text-gray-600">
                Configure your company profile and branding.
              </p>
            </div>
          </div>

          <!-- Debug Tab (only for superusers) -->
          <div v-if="activeTab === 'debug' && appStore.superuser">
            <div class="text-center py-12">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Debug</h2>
              <p class="text-gray-600">
                Development and debugging tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const activeTab = ref('pillars')

const tabs = computed(() => {
  const baseTabs = [
    { id: 'pillars', label: 'Pillars' },
    { id: 'studio', label: 'Studio' },
    { id: 'content', label: 'Content' },
    { id: 'settings', label: 'Settings' },
  ]

  if (appStore.superuser) {
    baseTabs.push({ id: 'debug', label: 'Debug' })
  }

  return baseTabs
})

async function handleLogout() {
  const result = await authStore.signOut()
  if (result.success) {
    appStore.reset()
    router.push('/login')
  }
}
</script>
