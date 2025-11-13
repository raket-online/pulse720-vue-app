import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Content } from '@/lib/supabase'

export const useContentStore = defineStore('content', () => {
  const contents = ref<Content[]>([])
  const currentContent = ref<Content | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const sortedContents = computed(() => {
    return [...contents.value].sort((a, b) => {
      return new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
    })
  })

  const getContentsByPillar = computed(() => (pillarId: string) => {
    return contents.value.filter(c => c.pillar_id === pillarId)
  })

  const getContentsByType = computed(() => (type: string) => {
    return contents.value.filter(c => c.type === type)
  })

  // Actions
  function setContents(newContents: Content[]) {
    contents.value = newContents
  }

  function addContent(content: Content) {
    contents.value.unshift(content)
  }

  function updateContent(id: string, updates: Partial<Content>) {
    const index = contents.value.findIndex(c => c.id === id)
    if (index !== -1) {
      contents.value[index] = { ...contents.value[index], ...updates } as Content
    }
  }

  function removeContent(id: string) {
    contents.value = contents.value.filter(c => c.id !== id)
  }

  function setCurrentContent(content: Content | null) {
    currentContent.value = content
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(value: string | null) {
    error.value = value
  }

  function reset() {
    contents.value = []
    currentContent.value = null
    loading.value = false
    error.value = null
  }

  return {
    contents,
    currentContent,
    loading,
    error,
    sortedContents,
    getContentsByPillar,
    getContentsByType,
    setContents,
    addContent,
    updateContent,
    removeContent,
    setCurrentContent,
    setLoading,
    setError,
    reset
  }
})
