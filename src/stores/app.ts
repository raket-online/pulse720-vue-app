import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserProfile } from '@/lib/supabase'

// Types
export interface Settings {
  company_name?: string
  company_website?: string
  target_audience?: string
  output_language?: string
  logo_url?: string
  [key: string]: any
}

export interface Pillar {
  id: string
  user_id: string
  title: string
  score?: number | null
  advice?: string | null
  create_date: string
  last_updated: string
}

export const useAppStore = defineStore('app', () => {
  // State
  const selectedPillar = ref<Pillar | null>(null)
  const defaultTab = ref<string>('pillars')
  const settings = ref<Settings>({})
  const superuser = ref<boolean>(false)
  const isFirstLoginFlow = ref<boolean>(false)
  const userProfile = ref<UserProfile | null>(null)

  // Content editing state
  const currentContent = ref<{
    content_id?: string
    type?: string
    title?: string
    content?: string
    hook?: string
    media_url?: string
    keywords?: string
    visual_description?: string
    json_content?: any
    status?: string
    scheduled_for?: string
  }>({})

  // UI state
  const buttonLoading = ref<boolean>(false)
  const isGeneratingImage = ref<boolean>(false)

  // Actions
  function setSelectedPillar(pillar: Pillar | null) {
    selectedPillar.value = pillar
  }

  function setDefaultTab(tab: string) {
    defaultTab.value = tab
  }

  function setSettings(newSettings: Settings) {
    settings.value = newSettings
  }

  function setSuperuser(isSuperuser: boolean) {
    superuser.value = isSuperuser
  }

  function setUserProfile(profile: UserProfile | null) {
    userProfile.value = profile
    if (profile) {
      superuser.value = profile.superuser || false
      settings.value = {
        company_name: profile.company_name || undefined,
        company_website: profile.company_website || undefined,
        target_audience: profile.target_audience || undefined,
        output_language: profile.output_language || undefined,
        logo_url: profile.logo_url || undefined
      }
    }
  }

  function setCurrentContent(content: Partial<typeof currentContent.value>) {
    currentContent.value = { ...currentContent.value, ...content }
  }

  function clearCurrentContent() {
    currentContent.value = {}
  }

  function reset() {
    selectedPillar.value = null
    defaultTab.value = 'pillars'
    settings.value = {}
    superuser.value = false
    userProfile.value = null
    currentContent.value = {}
    buttonLoading.value = false
    isGeneratingImage.value = false
  }

  return {
    // State
    selectedPillar,
    defaultTab,
    settings,
    superuser,
    isFirstLoginFlow,
    userProfile,
    currentContent,
    buttonLoading,
    isGeneratingImage,
    // Actions
    setSelectedPillar,
    setDefaultTab,
    setSettings,
    setSuperuser,
    setUserProfile,
    setCurrentContent,
    clearCurrentContent,
    reset,
  }
})
