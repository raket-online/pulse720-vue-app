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
              @click="handleTabChange(tab.id)"
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
            <PillarList
              :pillars="pillarStore.sortedPillars"
              :loading="pillarStore.loading"
              :error="pillarStore.error"
              :selected-pillar-id="pillarStore.currentPillar?.id"
              @create="showCreateModal = true"
              @select="handleSelectPillar"
              @edit="handleEditPillar"
              @delete="handleDeletePillar"
              @retry="loadPillars"
            />
          </div>

          <!-- Studio Tab -->
          <div v-if="activeTab === 'studio'">
            <div class="text-center py-12">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Studio</h2>
              <p class="text-gray-600">
                Select a pillar to start creating content.
              </p>
              <p v-if="pillarStore.currentPillar" class="text-primary-600 mt-4">
                Current Pillar: {{ pillarStore.currentPillar.title }}
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

    <!-- Modals -->
    <CreatePillarModal
      v-model="showCreateModal"
      :loading="createLoading"
      :error="createError"
      @submit="handleCreatePillar"
      @close="handleCloseCreateModal"
    />

    <EditPillarModal
      v-model="showEditModal"
      :pillar="pillarToEdit"
      :loading="editLoading"
      :error="editError"
      @submit="handleUpdatePillar"
      @close="handleCloseEditModal"
    />

    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :pillar="pillarToDelete"
      :loading="deleteLoading"
      :error="deleteError"
      @confirm="handleConfirmDelete"
      @close="handleCloseDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { usePillarStore } from '@/stores/pillar'
import PillarList from '@/components/pillars/PillarList.vue'
import CreatePillarModal from '@/components/pillars/CreatePillarModal.vue'
import EditPillarModal from '@/components/pillars/EditPillarModal.vue'
import DeleteConfirmationModal from '@/components/pillars/DeleteConfirmationModal.vue'
import * as pillarService from '@/services/pillar'
import type { Pillar } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const pillarStore = usePillarStore()

const activeTab = ref('pillars')

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// Loading and error states
const createLoading = ref(false)
const createError = ref<string | null>(null)
const editLoading = ref(false)
const editError = ref<string | null>(null)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)

// Pillar being edited/deleted
const pillarToEdit = ref<Pillar | null>(null)
const pillarToDelete = ref<Pillar | null>(null)

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

// Load pillars on mount
onMounted(async () => {
  await loadPillars()
})

async function loadPillars() {
  if (!authStore.userId) return

  pillarStore.setLoading(true)
  pillarStore.setError(null)

  const result = await pillarService.fetchPillars(authStore.userId)

  if (result.success && result.data) {
    pillarStore.setPillars(result.data)
  } else {
    pillarStore.setError(result.error || 'Failed to load pillars')
  }

  pillarStore.setLoading(false)
}

function handleTabChange(tabId: string) {
  activeTab.value = tabId
  appStore.setDefaultTab(tabId)
}

function handleSelectPillar(pillar: Pillar) {
  pillarStore.setCurrentPillar(pillar)
  appStore.setSelectedPillar(pillar)
  // Switch to Studio tab
  activeTab.value = 'studio'
  appStore.setDefaultTab('studio')
}

function handleEditPillar(pillar: Pillar) {
  pillarToEdit.value = pillar
  editError.value = null
  showEditModal.value = true
}

function handleDeletePillar(pillar: Pillar) {
  pillarToDelete.value = pillar
  deleteError.value = null
  showDeleteModal.value = true
}

async function handleCreatePillar(title: string) {
  if (!authStore.userId) return

  createLoading.value = true
  createError.value = null

  const result = await pillarService.createPillar(authStore.userId, title)

  if (result.success && result.data) {
    pillarStore.addPillar(result.data)
    pillarStore.setCurrentPillar(result.data)
    appStore.setSelectedPillar(result.data)
    showCreateModal.value = false
  } else {
    createError.value = result.error || 'Failed to create pillar'
  }

  createLoading.value = false
}

async function handleUpdatePillar(id: string, title: string) {
  editLoading.value = true
  editError.value = null

  const result = await pillarService.updatePillar(id, { title })

  if (result.success && result.data) {
    pillarStore.updatePillar(id, result.data)
    // Update current pillar if it's the one being edited
    if (pillarStore.currentPillar?.id === id) {
      pillarStore.setCurrentPillar(result.data)
      appStore.setSelectedPillar(result.data)
    }
    showEditModal.value = false
    pillarToEdit.value = null
  } else {
    editError.value = result.error || 'Failed to update pillar'
  }

  editLoading.value = false
}

async function handleConfirmDelete(id: string) {
  deleteLoading.value = true
  deleteError.value = null

  const result = await pillarService.deletePillar(id)

  if (result.success) {
    pillarStore.removePillar(id)
    // Clear selection if deleted pillar was selected
    if (pillarStore.currentPillar?.id === id) {
      pillarStore.setCurrentPillar(null)
      appStore.setSelectedPillar(null)
    }
    showDeleteModal.value = false
    pillarToDelete.value = null
  } else {
    deleteError.value = result.error || 'Failed to delete pillar'
  }

  deleteLoading.value = false
}

function handleCloseCreateModal() {
  showCreateModal.value = false
  createError.value = null
}

function handleCloseEditModal() {
  showEditModal.value = false
  editError.value = null
  pillarToEdit.value = null
}

function handleCloseDeleteModal() {
  showDeleteModal.value = false
  deleteError.value = null
  pillarToDelete.value = null
}

async function handleLogout() {
  const result = await authStore.signOut()
  if (result.success) {
    appStore.reset()
    pillarStore.reset()
    router.push('/login')
  }
}
</script>
