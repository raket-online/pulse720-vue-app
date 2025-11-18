import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Content } from '@/lib/supabase'
import type { GenerationProgress } from '@/services/contentGenerator'

export const useContentStore = defineStore('content', () => {
  const contents = ref<Content[]>([])
  const currentContent = ref<Content | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Generation state
  const isGenerating = ref(false)
  const generationProgress = ref<GenerationProgress | null>(null)
  const generationType = ref<'post' | 'blog' | 'carousel' | 'shortvideo' | null>(null)
  const generatedContent = ref<any>(null)

  // Studio state
  const selectedContentType = ref<'post' | 'blog' | 'carousel' | 'shortvideo'>('post')
  const selectedStyle = ref<string>('professional')
  const lastActiveTab = ref<string>('pillars')

  // Computed properties
  const sortedContents = computed(() => {
    return [...contents.value].sort((a, b) => {
      return new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
    })
  })

  const getContentsByPillar = computed(() => (pillarId: string) => {
    return contents.value.filter((c) => c.pillar_id === pillarId)
  })

  const getContentsByType = computed(() => (type: string) => {
    return contents.value.filter((c) => c.type === type)
  })

  // Actions
  function setContents(newContents: Content[]) {
    contents.value = newContents
  }

  function addContent(content: Content) {
    contents.value.unshift(content)
  }

  function updateContent(id: string, updates: Partial<Content>) {
    const index = contents.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      contents.value[index] = { ...contents.value[index], ...updates } as Content
    }
  }

  function removeContent(id: string) {
    contents.value = contents.value.filter((c) => c.id !== id)
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
    isGenerating.value = false
    generationProgress.value = null
    generationType.value = null
    generatedContent.value = null
  }

  // Generation actions
  function setGenerating(value: boolean) {
    isGenerating.value = value
  }

  function setGenerationProgress(progress: GenerationProgress | null) {
    generationProgress.value = progress
  }

  function setGenerationType(type: 'post' | 'blog' | 'carousel' | 'shortvideo' | null) {
    generationType.value = type
  }

  function setGeneratedContent(content: any) {
    generatedContent.value = content
  }

  function clearGeneration() {
    isGenerating.value = false
    generationProgress.value = null
    generationType.value = null
    generatedContent.value = null
  }

  // Studio actions
  function setSelectedContentType(type: 'post' | 'blog' | 'carousel' | 'shortvideo') {
    selectedContentType.value = type
  }

  function setSelectedStyle(style: string) {
    selectedStyle.value = style
  }

  function setLastActiveTab(tab: string) {
    lastActiveTab.value = tab
  }

  return {
    // Content state
    contents,
    currentContent,
    loading,
    error,
    // Generation state
    isGenerating,
    generationProgress,
    generationType,
    generatedContent,
    // Studio state
    selectedContentType,
    selectedStyle,
    lastActiveTab,
    // Computed
    sortedContents,
    getContentsByPillar,
    getContentsByType,
    // Content actions
    setContents,
    addContent,
    updateContent,
    removeContent,
    setCurrentContent,
    setLoading,
    setError,
    reset,
    // Generation actions
    setGenerating,
    setGenerationProgress,
    setGenerationType,
    setGeneratedContent,
    clearGeneration,
    // Studio actions
    setSelectedContentType,
    setSelectedStyle,
    setLastActiveTab,
  }
})
