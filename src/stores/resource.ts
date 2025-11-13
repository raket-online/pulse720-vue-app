import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Resource } from '@/lib/supabase'

export const useResourceStore = defineStore('resource', () => {
  // State
  const resources = ref<Resource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const resourceCount = computed(() => resources.value.length)
  const hasResources = computed(() => resources.value.length > 0)
  const sortedResources = computed(() => {
    return [...resources.value].sort((a, b) => {
      return new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
    })
  })

  // Get resources for a specific pillar
  const getResourcesByPillar = computed(() => (pillarId: string) => {
    return resources.value.filter(r => r.pillar_id === pillarId)
  })

  // Actions
  function setResources(newResources: Resource[]) {
    resources.value = newResources
  }

  function addResource(resource: Resource) {
    resources.value.push(resource)
  }

  function updateResource(id: string, updates: Partial<Resource>) {
    const index = resources.value.findIndex(r => r.id === id)
    if (index !== -1) {
      resources.value[index] = { ...resources.value[index], ...updates } as Resource
    }
  }

  function removeResource(id: string) {
    resources.value = resources.value.filter(r => r.id !== id)
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function reset() {
    resources.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    resources,
    loading,
    error,
    // Getters
    resourceCount,
    hasResources,
    sortedResources,
    getResourcesByPillar,
    // Actions
    setResources,
    addResource,
    updateResource,
    removeResource,
    setLoading,
    setError,
    reset,
  }
})
