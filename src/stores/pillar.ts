import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Pillar } from '@/lib/supabase'

export const usePillarStore = defineStore('pillar', () => {
  // State
  const pillars = ref<Pillar[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPillar = ref<Pillar | null>(null)

  // Getters
  const pillarCount = computed(() => pillars.value.length)
  const hasPillars = computed(() => pillars.value.length > 0)
  const sortedPillars = computed(() => {
    return [...pillars.value].sort((a, b) => {
      return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
    })
  })

  // Actions
  function setPillars(newPillars: Pillar[]) {
    pillars.value = newPillars
  }

  function addPillar(pillar: Pillar) {
    pillars.value.push(pillar)
  }

  function updatePillar(id: string, updates: Partial<Pillar>) {
    const index = pillars.value.findIndex(p => p.id === id)
    if (index !== -1) {
      pillars.value[index] = { ...pillars.value[index], ...updates } as Pillar
    }
  }

  function removePillar(id: string) {
    pillars.value = pillars.value.filter(p => p.id !== id)
    if (currentPillar.value?.id === id) {
      currentPillar.value = null
    }
  }

  function setCurrentPillar(pillar: Pillar | null) {
    currentPillar.value = pillar
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function reset() {
    pillars.value = []
    currentPillar.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    pillars,
    loading,
    error,
    currentPillar,
    // Getters
    pillarCount,
    hasPillars,
    sortedPillars,
    // Actions
    setPillars,
    addPillar,
    updatePillar,
    removePillar,
    setCurrentPillar,
    setLoading,
    setError,
    reset,
  }
})
