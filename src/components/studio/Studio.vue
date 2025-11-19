<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-2xl font-bold text-primary-600 mb-6">Content Studio</h2>

      <!-- Content Type Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="type in contentTypes"
            :key="type.value"
            :class="[
              'p-4 rounded-lg border-2 transition-all text-left',
              selectedType === type.value
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300',
            ]"
            @click="selectedType = type.value"
          >
            <div class="text-2xl mb-1">
              {{ type.icon }}
            </div>
            <div class="font-medium text-sm">
              {{ type.label }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ type.description }}
            </div>
          </button>
        </div>
      </div>

      <!-- Pillar Selection -->
      <div class="mb-6">
        <label for="pillar" class="block text-sm font-medium text-gray-700 mb-2">
          Select Pillar
        </label>
        <select id="pillar" v-model="selectedPillarId" class="input-field" :disabled="isGenerating">
          <option value="">Choose a pillar...</option>
          <option v-for="pillar in pillars" :key="pillar.id" :value="pillar.id">
            {{ pillar.title }}
          </option>
        </select>
        <p v-if="selectedPillar" class="text-xs text-gray-500 mt-1">
          {{ resourceCount }} resource(s) available
        </p>
      </div>

      <!-- Writing Style -->
      <div class="mb-6">
        <label for="style" class="block text-sm font-medium text-gray-700 mb-2">
          Writing Style
        </label>
        <select id="style" v-model="selectedStyle" class="input-field" :disabled="isGenerating">
          <option v-for="style in writingStyles" :key="style.value" :value="style.value">
            {{ style.label }}
          </option>
        </select>
      </div>

      <!-- Generate Button -->
      <div class="flex items-center gap-4">
        <button
          class="btn-primary"
          :disabled="!canGenerate || isGenerating"
          @click="handleGenerate"
        >
          <span v-if="!isGenerating">Generate {{ contentTypeLabel }}</span>
          <span v-else class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Generating...
          </span>
        </button>

        <p v-if="!selectedPillarId" class="text-sm text-gray-500">Select a pillar to continue</p>
      </div>

      <!-- Progress Indicator -->
      <div v-if="isGenerating && generationProgress" class="mt-6">
        <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">{{ generationProgress.message }}</span>
            <span class="text-sm text-gray-600">{{ generationProgress.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${generationProgress.progress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContentStore } from '@/stores/content'
import { usePillarStore } from '@/stores/pillar'
import { useResourceStore } from '@/stores/resource'
import { useAppStore } from '@/stores/app'
import { WRITING_STYLES } from '@/services/prompts'
import {
  generatePost,
  generateBlog,
  generateCarouselContent,
  generateShortVideo,
} from '@/services/contentGenerator'

const contentStore = useContentStore()
const pillarStore = usePillarStore()
const resourceStore = useResourceStore()
const appStore = useAppStore()

const emit = defineEmits<{
  (e: 'generated', result: any, pillarId: string): void
}>()

const contentTypes = [
  {
    value: 'post' as const,
    label: 'Social Post',
    icon: '📱',
    description: '2-3 min read',
  },
  {
    value: 'blog' as const,
    label: 'Blog Article',
    icon: '📝',
    description: '5-10 min read',
  },
  {
    value: 'carousel' as const,
    label: 'Carousel',
    icon: '🎠',
    description: '5-8 slides',
  },
  {
    value: 'shortvideo' as const,
    label: 'Short Video',
    icon: '🎬',
    description: '60-90 seconds',
  },
]

const selectedType = ref<'post' | 'blog' | 'carousel' | 'shortvideo'>('post' as const)
const selectedPillarId = ref('')
const selectedStyle = ref('professional')
const error = ref<string | null>(null)

const writingStyles = WRITING_STYLES
const pillars = computed(() => pillarStore.pillars)
const selectedPillar = computed(() => pillars.value.find((p) => p.id === selectedPillarId.value))
const resourceCount = computed(() => {
  if (!selectedPillarId.value) return 0
  return resourceStore.resources.filter((r) => r.pillar_id === selectedPillarId.value).length
})

const isGenerating = computed(() => contentStore.isGenerating)
const generationProgress = computed(() => contentStore.generationProgress)

const contentTypeLabel = computed(() => {
  const type = contentTypes.find((t) => t.value === selectedType.value)
  return type?.label || 'Content'
})

const canGenerate = computed(() => {
  return selectedPillarId.value && resourceCount.value > 0
})

async function handleGenerate() {
  if (!selectedPillarId.value || !selectedPillar.value) {
    error.value = 'Please select a pillar'
    return
  }

  try {
    error.value = null
    contentStore.setGenerating(true)
    contentStore.setGenerationType(selectedType.value)
    contentStore.setSelectedContentType(selectedType.value)
    contentStore.setSelectedStyle(selectedStyle.value)

    // Get resources for pillar
    const pillarResources = resourceStore.resources.filter(
      (r) => r.pillar_id === selectedPillarId.value
    )

    if (pillarResources.length === 0) {
      throw new Error('No resources found for this pillar')
    }

    // Get user profile settings
    const profile = appStore.userProfile

    const options = {
      contentType: selectedType.value,
      pillarTitle: selectedPillar.value.title,
      resources: pillarResources,
      targetMarket: profile?.target_audience || 'General audience',
      language: profile?.output_language || 'English',
      style: selectedStyle.value,
      brandPrimaryColor: profile?.settings?.brand_primary_color,
      brandSecondaryColor: profile?.settings?.brand_secondary_color,
      signature: profile?.settings?.signature,
      // Carousel settings
      carouselSettings: {
        textColor: profile?.settings?.carousel_text_color,
        backgroundColor: profile?.settings?.carousel_background_color,
        font: profile?.settings?.carousel_font,
        fontSize: profile?.settings?.carousel_font_size,
        logoUrl: profile?.logo_url,
      },
      // Video settings
      videoSettings: {
        voiceName: profile?.settings?.shortvideo_voice_name,
        music: profile?.settings?.shortvideo_music,
        font: profile?.settings?.shortvideo_font,
        fontSize: profile?.settings?.shortvideo_font_size,
        textColor: profile?.settings?.shortvideo_text_color,
        highlightColor: profile?.settings?.shortvideo_highlight_color,
        enableSubtitles: profile?.settings?.shortvideo_enable_subtitles,
      },
    }

    const progressCallback = (progress: any) => {
      contentStore.setGenerationProgress(progress)
    }

    let result
    switch (selectedType.value) {
      case 'post':
        result = await generatePost(options as any, progressCallback)
        break
      case 'blog':
        result = await generateBlog(options as any, progressCallback)
        break
      case 'carousel':
        result = await generateCarouselContent(options as any, progressCallback)
        break
      case 'shortvideo':
        result = await generateShortVideo(options as any, progressCallback)
        break
    }

    if (!result.success) {
      throw new Error(result.error || 'Generation failed')
    }

    contentStore.setGeneratedContent(result.data)
    emit('generated', result.data, selectedPillarId.value)
  } catch (err) {
    console.error('Generation error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to generate content'
  } finally {
    contentStore.setGenerating(false)
  }
}
</script>
