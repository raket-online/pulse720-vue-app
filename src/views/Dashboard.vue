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
            <div v-if="!pillarStore.currentPillar" class="text-center py-12">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Studio</h2>
              <p class="text-gray-600 mb-6">
                Select a pillar from the Pillars tab to view its resources and create content.
              </p>
              <button @click="activeTab = 'pillars'" class="btn-primary">
                Go to Pillars
              </button>
            </div>
            <div v-else>
              <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900">{{ pillarStore.currentPillar.title }}</h2>
                <p v-if="pillarStore.currentPillar.advice" class="text-gray-600 mt-2">
                  {{ pillarStore.currentPillar.advice }}
                </p>
              </div>
              <ResourceList
                :resources="currentPillarResources"
                :loading="resourceStore.loading"
                :error="resourceStore.error"
                @addText="showAddTextModal = true"
                @addURL="showAddURLModal = true"
                @addPDF="showAddPDFModal = true"
                @addAudio="showAddAudioModal = true"
                @delete="handleDeleteResource"
                @retry="loadResources"
              />
            </div>
          </div>
          <!-- Content Tab -->
          <div v-if="activeTab === 'content'">
            <ContentList
              :contents="contentStore.sortedContents"
              :loading="contentStore.loading"
              :error="contentStore.error"
              @generate="showGenerateModal = true"
              @view="handleViewContent"
              @edit="handleEditContent"
              @delete="handleDeleteContent"
              @retry="loadContents"
            />
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'">
            <UserProfile
              :user-id="authStore.userId || ''"
              :profile="appStore.userProfile"
              :superuser="appStore.superuser"
              :loading="profileLoading"
              :error="profileError"
              :success="profileSuccess"
              @submit="handleUpdateProfile"
            />
          </div>

          <!-- Debug Tab (only for superusers) -->
          <div v-if="activeTab === 'debug' && appStore.superuser">
            <div class="max-w-6xl mx-auto">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Debug Information</h2>

                <!-- Store States -->
                <div class="space-y-6">
                  <!-- Auth Store -->
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Authentication</h3>
                    <div class="bg-gray-50 rounded p-4 font-mono text-sm">
                      <p><strong>User ID:</strong> {{ authStore.userId }}</p>
                      <p><strong>Session:</strong> {{ authStore.session ? 'Active' : 'None' }}</p>
                    </div>
                  </div>

                  <!-- Pillar Store -->
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Pillars</h3>
                    <div class="bg-gray-50 rounded p-4 font-mono text-sm">
                      <p><strong>Total:</strong> {{ pillarStore.pillars.length }}</p>
                      <p><strong>Current:</strong> {{ pillarStore.currentPillar?.title || 'None' }}</p>
                      <p><strong>Loading:</strong> {{ pillarStore.loading }}</p>
                      <p><strong>Error:</strong> {{ pillarStore.error || 'None' }}</p>
                    </div>
                  </div>

                  <!-- Resource Store -->
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Resources</h3>
                    <div class="bg-gray-50 rounded p-4 font-mono text-sm">
                      <p><strong>Total:</strong> {{ resourceStore.resources.length }}</p>
                      <p><strong>Current Pillar:</strong> {{ currentPillarResources.length }}</p>
                      <p><strong>Loading:</strong> {{ resourceStore.loading }}</p>
                      <p><strong>Error:</strong> {{ resourceStore.error || 'None' }}</p>
                    </div>
                  </div>

                  <!-- Content Store -->
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Content</h3>
                    <div class="bg-gray-50 rounded p-4 font-mono text-sm">
                      <p><strong>Total:</strong> {{ contentStore.contents.length }}</p>
                      <p><strong>Loading:</strong> {{ contentStore.loading }}</p>
                      <p><strong>Error:</strong> {{ contentStore.error || 'None' }}</p>
                    </div>
                  </div>

                  <!-- App Store -->
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">App Settings</h3>
                    <div class="bg-gray-50 rounded p-4 font-mono text-sm">
                      <p><strong>Superuser:</strong> {{ appStore.superuser }}</p>
                      <p><strong>Default Tab:</strong> {{ appStore.defaultTab }}</p>
                      <p><strong>Company:</strong> {{ appStore.settings.company_name || 'Not set' }}</p>
                      <p><strong>Language:</strong> {{ appStore.settings.output_language || 'Not set' }}</p>
                    </div>
                  </div>
                </div>
              </div>
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
      v-model="showEditPillarModal"
      :pillar="pillarToEdit"
      :loading="editLoading"
      :error="editError"
      @submit="handleUpdatePillar"
      @close="handleCloseEditPillarModal"
    />

    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :pillar="pillarToDelete"
      :loading="deleteLoading"
      :error="deleteError"
      @confirm="handleConfirmDelete"
      @close="handleCloseDeleteModal"
    />

    <!-- Resource Modals -->
    <AddTextModal
      v-model="showAddTextModal"
      :loading="addResourceLoading"
      :error="addResourceError"
      @submit="handleAddTextResource"
      @close="handleCloseAddTextModal"
    />

    <AddURLModal
      v-model="showAddURLModal"
      :loading="addResourceLoading"
      :error="addResourceError"
      @submit="handleAddURLResource"
      @close="handleCloseAddURLModal"
    />

    <AddPDFModal
      v-model="showAddPDFModal"
      :loading="addResourceLoading"
      :error="addResourceError"
      @submit="handleAddPDFResource"
      @close="handleCloseAddPDFModal"
    />

    <AddAudioModal
      v-model="showAddAudioModal"
      :loading="addResourceLoading"
      :error="addResourceError"
      @submit="handleAddAudioResource"
      @close="handleCloseAddAudioModal"
    />

    <!-- Content Modals -->
    <GenerateContentModal
      v-model="showGenerateModal"
      :pillars="pillarStore.pillars"
      :selected-pillar="pillarStore.currentPillar"
      :loading="generateLoading"
      :error="generateError"
      @submit="handleGenerateContent"
      @close="handleCloseGenerateModal"
      @pillar-change="handleGenerateModalPillarChange"
      ref="generateModalRef"
    />

    <ViewContentModal
      v-model="showViewModal"
      :content="contentToView"
      @close="handleCloseViewModal"
    />

    <EditContentModal
      v-model="showEditModal"
      :content="contentToEdit"
      :loading="editContentLoading"
      :error="editContentError"
      @submit="handleSubmitEditContent"
      @close="handleCloseEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { usePillarStore } from '@/stores/pillar'
import { useResourceStore } from '@/stores/resource'
import { useContentStore } from '@/stores/content'
import PillarList from '@/components/pillars/PillarList.vue'
import CreatePillarModal from '@/components/pillars/CreatePillarModal.vue'
import EditPillarModal from '@/components/pillars/EditPillarModal.vue'
import DeleteConfirmationModal from '@/components/pillars/DeleteConfirmationModal.vue'
import ResourceList from '@/components/resources/ResourceList.vue'
import AddTextModal from '@/components/resources/AddTextModal.vue'
import AddURLModal from '@/components/resources/AddURLModal.vue'
import AddPDFModal from '@/components/resources/AddPDFModal.vue'
import AddAudioModal from '@/components/resources/AddAudioModal.vue'
import ContentList from '@/components/content/ContentList.vue'
import GenerateContentModal from '@/components/content/GenerateContentModal.vue'
import ViewContentModal from '@/components/content/ViewContentModal.vue'
import EditContentModal from '@/components/content/EditContentModal.vue'
import UserProfile from '@/components/settings/UserProfile.vue'
import * as pillarService from '@/services/pillar'
import * as resourceService from '@/services/resource'
import * as contentService from '@/services/content'
import * as userProfileService from '@/services/userProfile'
import * as aiService from '@/services/ai'
import type { Pillar, Resource, Content } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const pillarStore = usePillarStore()
const resourceStore = useResourceStore()
const contentStore = useContentStore()

const activeTab = ref('pillars')

// Pillar modal states
const showCreateModal = ref(false)
const showEditPillarModal = ref(false)
const showDeleteModal = ref(false)

// Pillar loading and error states
const createLoading = ref(false)
const createError = ref<string | null>(null)
const editLoading = ref(false)
const editError = ref<string | null>(null)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)

// Pillar being edited/deleted
const pillarToEdit = ref<Pillar | null>(null)
const pillarToDelete = ref<Pillar | null>(null)

// Resource modal states
const showAddTextModal = ref(false)
const showAddURLModal = ref(false)
const showAddPDFModal = ref(false)
const showAddAudioModal = ref(false)

// Resource loading and error states
const addResourceLoading = ref(false)
const addResourceError = ref<string | null>(null)

// Content modal states
const showGenerateModal = ref(false)
const showViewModal = ref(false)
const showEditModal = ref(false)

// Content loading and error states
const generateLoading = ref(false)
const generateError = ref<string | null>(null)
const editContentLoading = ref(false)
const editContentError = ref<string | null>(null)

// Content being viewed/edited
const contentToView = ref<Content | null>(null)
const contentToEdit = ref<Content | null>(null)

// Profile states
const profileLoading = ref(false)
const profileError = ref<string | null>(null)
const profileSuccess = ref(false)

// Generate modal ref
const generateModalRef = ref<InstanceType<typeof GenerateContentModal> | null>(null)

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

// Computed property for current pillar's resources
const currentPillarResources = computed(() => {
  if (!pillarStore.currentPillar) return []
  return resourceStore.getResourcesByPillar(pillarStore.currentPillar.id)
})

// Load pillars, resources, content, and profile on mount
onMounted(async () => {
  await Promise.all([
    loadPillars(),
    loadContents(),
    loadUserProfile()
  ])
  // If there's a selected pillar (e.g., from page refresh), load its resources
  if (pillarStore.currentPillar) {
    await loadResources()
  }
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

async function handleSelectPillar(pillar: Pillar) {
  pillarStore.setCurrentPillar(pillar)
  appStore.setSelectedPillar(pillar)
  // Switch to Studio tab
  activeTab.value = 'studio'
  appStore.setDefaultTab('studio')
  // Load resources for the selected pillar
  await loadResources()
}

function handleEditPillar(pillar: Pillar) {
  pillarToEdit.value = pillar
  editError.value = null
  showEditPillarModal.value = true
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

function handleCloseEditPillarModal() {
  showEditPillarModal.value = false
  editError.value = null
  pillarToEdit.value = null
}

function handleCloseDeleteModal() {
  showDeleteModal.value = false
  deleteError.value = null
  pillarToDelete.value = null
}

// Resource management functions
async function loadResources() {
  if (!pillarStore.currentPillar) return

  resourceStore.setLoading(true)
  resourceStore.setError(null)

  const result = await resourceService.fetchResources(pillarStore.currentPillar.id)

  if (result.success && result.data) {
    resourceStore.setResources(result.data)
  } else {
    resourceStore.setError(result.error || 'Failed to load resources')
  }

  resourceStore.setLoading(false)
}

async function handleAddTextResource(data: { title: string; content: string }) {
  if (!pillarStore.currentPillar) return

  addResourceLoading.value = true
  addResourceError.value = null

  // First, summarize the resource using AI
  const summaryResult = await aiService.summarizeResource(data.content)

  if (!summaryResult.success) {
    addResourceError.value = summaryResult.error || 'Failed to analyze resource'
    addResourceLoading.value = false
    return
  }

  // Create the resource with AI-generated summary
  const result = await resourceService.createResource({
    pillar_id: pillarStore.currentPillar.id,
    title: data.title,
    content: data.content,
    score: summaryResult.data?.score || 0,
    advice: summaryResult.data?.advice
  })

  if (result.success && result.data) {
    resourceStore.addResource(result.data)
    showAddTextModal.value = false

    // Re-evaluate pillar with all resources
    await evaluatePillarWithResources()
  } else {
    addResourceError.value = result.error || 'Failed to create resource'
  }

  addResourceLoading.value = false
}

async function handleAddURLResource(url: string) {
  if (!pillarStore.currentPillar) return

  addResourceLoading.value = true
  addResourceError.value = null

  let content: string
  let title: string

  // Check if it's a YouTube URL
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')

  if (isYouTube) {
    const transcriptResult = await aiService.youtubeTranscript(url)

    if (!transcriptResult.success) {
      addResourceError.value = transcriptResult.error || 'Failed to extract YouTube transcript'
      addResourceLoading.value = false
      return
    }

    content = transcriptResult.data || ''
    title = `YouTube: ${url}`
  } else {
    const crawlResult = await aiService.crawlURL(url)

    if (!crawlResult.success) {
      addResourceError.value = crawlResult.error || 'Failed to extract content from URL'
      addResourceLoading.value = false
      return
    }

    content = crawlResult.data?.text || ''
    title = crawlResult.data?.title || url
  }

  // Summarize the extracted content
  const summaryResult = await aiService.summarizeResource(content)

  if (!summaryResult.success) {
    addResourceError.value = summaryResult.error || 'Failed to analyze resource'
    addResourceLoading.value = false
    return
  }

  // Create the resource
  const result = await resourceService.createResource({
    pillar_id: pillarStore.currentPillar.id,
    title,
    content,
    file_url: url,
    score: summaryResult.data?.score || 0,
    advice: summaryResult.data?.advice
  })

  if (result.success && result.data) {
    resourceStore.addResource(result.data)
    showAddURLModal.value = false

    // Re-evaluate pillar with all resources
    await evaluatePillarWithResources()
  } else {
    addResourceError.value = result.error || 'Failed to create resource'
  }

  addResourceLoading.value = false
}

async function handleAddPDFResource(data: { file: File; base64: string }) {
  if (!pillarStore.currentPillar) return

  addResourceLoading.value = true
  addResourceError.value = null

  // Extract text from PDF
  const pdfResult = await aiService.pdfToText(data.base64, data.file.name)

  if (!pdfResult.success) {
    addResourceError.value = pdfResult.error || 'Failed to extract text from PDF'
    addResourceLoading.value = false
    return
  }

  const content = pdfResult.data || ''

  // Summarize the extracted content
  const summaryResult = await aiService.summarizeResource(content)

  if (!summaryResult.success) {
    addResourceError.value = summaryResult.error || 'Failed to analyze resource'
    addResourceLoading.value = false
    return
  }

  // Create the resource
  const result = await resourceService.createResource({
    pillar_id: pillarStore.currentPillar.id,
    title: data.file.name,
    content,
    filename: data.file.name,
    score: summaryResult.data?.score || 0,
    advice: summaryResult.data?.advice
  })

  if (result.success && result.data) {
    resourceStore.addResource(result.data)
    showAddPDFModal.value = false

    // Re-evaluate pillar with all resources
    await evaluatePillarWithResources()
  } else {
    addResourceError.value = result.error || 'Failed to create resource'
  }

  addResourceLoading.value = false
}

async function handleAddAudioResource(transcript: string) {
  if (!pillarStore.currentPillar) return

  addResourceLoading.value = true
  addResourceError.value = null

  // Summarize the transcript
  const summaryResult = await aiService.summarizeResource(transcript)

  if (!summaryResult.success) {
    addResourceError.value = summaryResult.error || 'Failed to analyze transcript'
    addResourceLoading.value = false
    return
  }

  // Create the resource
  const result = await resourceService.createResource({
    pillar_id: pillarStore.currentPillar.id,
    title: `Audio Recording - ${new Date().toLocaleString()}`,
    content: transcript,
    score: summaryResult.data?.score || 0,
    advice: summaryResult.data?.advice
  })

  if (result.success && result.data) {
    resourceStore.addResource(result.data)
    showAddAudioModal.value = false

    // Re-evaluate pillar with all resources
    await evaluatePillarWithResources()
  } else {
    addResourceError.value = result.error || 'Failed to create resource'
  }

  addResourceLoading.value = false
}

async function handleDeleteResource(resource: Resource) {
  if (!confirm(`Are you sure you want to delete "${resource.title}"?`)) return

  const result = await resourceService.deleteResource(resource.id)

  if (result.success) {
    resourceStore.removeResource(resource.id)

    // Re-evaluate pillar with remaining resources
    await evaluatePillarWithResources()
  } else {
    alert(result.error || 'Failed to delete resource')
  }
}

async function evaluatePillarWithResources() {
  if (!pillarStore.currentPillar) return

  const resources = currentPillarResources.value
  if (resources.length === 0) return

  // Collect all resource content
  const resourceContents = resources.map(r => r.content)

  // Evaluate the pillar with all resources
  const evaluationResult = await aiService.evaluatePillar(resourceContents)

  if (evaluationResult.success && evaluationResult.data) {
    // Update the pillar with new evaluation
    const updateResult = await pillarService.updatePillarEvaluation(
      pillarStore.currentPillar.id,
      evaluationResult.data.score,
      evaluationResult.data.advice
    )

    if (updateResult.success && updateResult.data) {
      pillarStore.updatePillar(pillarStore.currentPillar.id, updateResult.data)
      pillarStore.setCurrentPillar(updateResult.data)
      appStore.setSelectedPillar(updateResult.data)
    }
  }
}

function handleCloseAddTextModal() {
  showAddTextModal.value = false
  addResourceError.value = null
}

function handleCloseAddURLModal() {
  showAddURLModal.value = false
  addResourceError.value = null
}

function handleCloseAddPDFModal() {
  showAddPDFModal.value = false
  addResourceError.value = null
}

function handleCloseAddAudioModal() {
  showAddAudioModal.value = false
  addResourceError.value = null
}

// Content management functions
async function loadContents() {
  if (!authStore.userId) return

  contentStore.setLoading(true)
  contentStore.setError(null)

  const result = await contentService.fetchContents(authStore.userId)

  if (result.success && result.data) {
    contentStore.setContents(result.data)
  } else {
    contentStore.setError(result.error || 'Failed to load content')
  }

  contentStore.setLoading(false)
}

async function handleGenerateContent(data: {
  pillarId: string
  contentType: string
  instructions: string
}) {
  if (!authStore.userId) return

  generateLoading.value = true
  generateError.value = null

  // Get the pillar
  const pillar = pillarStore.pillars.find(p => p.id === data.pillarId)
  if (!pillar) {
    generateError.value = 'Pillar not found'
    generateLoading.value = false
    return
  }

  // Get resources for this pillar
  const resources = resourceStore.getResourcesByPillar(data.pillarId)
  const resourceContents = resources.map(r => r.content)

  if (resourceContents.length === 0) {
    generateError.value = 'This pillar has no resources. Add resources first to generate quality content.'
    generateLoading.value = false
    return
  }

  // Generate content using AI
  const generationResult = await aiService.generateContent(
    data.contentType,
    pillar.title,
    resourceContents,
    data.instructions
  )

  if (!generationResult.success || !generationResult.data) {
    generateError.value = generationResult.error || 'Failed to generate content'
    generateLoading.value = false
    return
  }

  // Create the content
  const result = await contentService.createContent({
    pillar_id: data.pillarId,
    user_id: authStore.userId,
    type: data.contentType,
    title: generationResult.data.title,
    content: generationResult.data.content,
    hook: generationResult.data.hook,
    keywords: generationResult.data.keywords,
    visual_description: generationResult.data.visual_description
  })

  if (result.success && result.data) {
    contentStore.addContent(result.data)
    showGenerateModal.value = false
    generateError.value = null

    // Switch to content tab to show the new content
    activeTab.value = 'content'
    appStore.setDefaultTab('content')
  } else {
    generateError.value = result.error || 'Failed to save content'
  }

  generateLoading.value = false
}

function handleViewContent(content: Content) {
  contentToView.value = content
  showViewModal.value = true
}

function handleEditContent(content: Content) {
  contentToEdit.value = content
  showEditModal.value = true
}

async function handleSubmitEditContent(data: {
  title: string
  content: string
  hook?: string
  keywords?: string
  visual_description?: string
}) {
  if (!contentToEdit.value) return

  editContentLoading.value = true
  editContentError.value = null

  const result = await contentService.updateContent(contentToEdit.value.id, data)

  if (result.success && result.data) {
    contentStore.updateContent(contentToEdit.value.id, result.data)
    showEditModal.value = false
    contentToEdit.value = null
  } else {
    editContentError.value = result.error || 'Failed to update content'
  }

  editContentLoading.value = false
}

function handleCloseEditModal() {
  showEditModal.value = false
  editContentError.value = null
  contentToEdit.value = null
}

async function handleDeleteContent(content: Content) {
  if (!confirm(`Are you sure you want to delete "${content.title}"?`)) return

  const result = await contentService.deleteContent(content.id)

  if (result.success) {
    contentStore.removeContent(content.id)
  } else {
    alert(result.error || 'Failed to delete content')
  }
}

async function handleGenerateModalPillarChange(pillarId: string) {
  // Update resource count in the generate modal
  const resources = resourceStore.getResourcesByPillar(pillarId)
  if (generateModalRef.value) {
    generateModalRef.value.setResourceCount(resources.length)
  }
}

function handleCloseGenerateModal() {
  showGenerateModal.value = false
  generateError.value = null
}

function handleCloseViewModal() {
  showViewModal.value = false
  contentToView.value = null
}

// User profile management functions
async function loadUserProfile() {
  if (!authStore.userId) return

  const result = await userProfileService.fetchUserProfile(authStore.userId)

  if (result.success && result.data) {
    appStore.setUserProfile(result.data)
  } else if (result.error?.includes('No rows')) {
    // Profile doesn't exist yet, create it
    const createResult = await userProfileService.createUserProfile(authStore.userId)
    if (createResult.success && createResult.data) {
      appStore.setUserProfile(createResult.data)
    }
  }
}

async function handleUpdateProfile(updates: {
  company_name?: string
  company_website?: string
  logo_url?: string
  target_audience?: string
  output_language?: string
}) {
  if (!authStore.userId) return

  profileLoading.value = true
  profileError.value = null
  profileSuccess.value = false

  const result = await userProfileService.updateUserProfile(authStore.userId, updates)

  if (result.success && result.data) {
    appStore.setUserProfile(result.data)
    profileSuccess.value = true
    setTimeout(() => {
      profileSuccess.value = false
    }, 3000)
  } else {
    profileError.value = result.error || 'Failed to update profile'
  }

  profileLoading.value = false
}

async function handleLogout() {
  const result = await authStore.signOut()
  if (result.success) {
    appStore.reset()
    pillarStore.reset()
    resourceStore.reset()
    contentStore.reset()
    router.push('/login')
  }
}
</script>
