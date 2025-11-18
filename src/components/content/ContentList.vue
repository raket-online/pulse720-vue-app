<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-lg font-medium">Failed to load content</p>
        <p class="text-sm text-gray-600 mt-1">{{ error }}</p>
      </div>
      <button @click="$emit('retry')" class="btn-primary">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="contents.length === 0" class="text-center py-12">
      <div class="mb-6">
        <svg
          class="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Content Yet</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Start generating content from your pillar resources. AI will create engaging posts,
        blog articles, carousels, and short video scripts.
      </p>
      <button @click="$emit('generate')" class="btn-primary">
        <svg
          class="w-5 h-5 inline-block mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Generate Content
      </button>
    </div>

    <!-- Content Grid -->
    <div v-else>
      <!-- Header with filters and generate button -->
      <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div class="flex items-center gap-4">
          <div>
            <h2 class="text-xl font-semibold text-primary-600">Content Library</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ filteredContents.length }} item{{ filteredContents.length !== 1 ? 's' : '' }}
              <span v-if="selectedType">({{ selectedType }})</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Type Filter -->
          <select
            v-model="selectedType"
            class="input-field text-sm py-2"
            @change="$emit('filter', selectedType)"
          >
            <option value="">All Types</option>
            <option value="post">Post</option>
            <option value="blog">Blog</option>
            <option value="carousel">Carousel</option>
            <option value="shortvideo">Short Video</option>
          </select>

          <!-- Generate Button -->
          <button @click="$emit('generate')" class="btn-primary text-sm">
            <svg
              class="w-4 h-4 inline-block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Generate
          </button>
        </div>
      </div>

      <!-- Grid of content cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentCard
          v-for="content in filteredContents"
          :key="content.id"
          :content="content"
          :can-post-to-linked-in="canPostToLinkedIn"
          @view="$emit('view', content)"
          @edit="$emit('edit', content)"
          @delete="$emit('delete', content)"
          @post-to-linked-in="$emit('postToLinkedIn', content)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ContentCard from './ContentCard.vue'
import type { Content } from '@/lib/supabase'

interface Props {
  contents: Content[]
  loading?: boolean
  error?: string | null
  canPostToLinkedIn?: boolean
}

interface Emits {
  (e: 'generate'): void
  (e: 'view', content: Content): void
  (e: 'edit', content: Content): void
  (e: 'delete', content: Content): void
  (e: 'postToLinkedIn', content: Content): void
  (e: 'retry'): void
  (e: 'filter', type: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  canPostToLinkedIn: false,
})

const emit = defineEmits<Emits>()

const selectedType = ref('')

const filteredContents = computed(() => {
  if (!selectedType.value) {
    return props.contents
  }
  return props.contents.filter((c) => c.type.toLowerCase() === selectedType.value.toLowerCase())
})
</script>
