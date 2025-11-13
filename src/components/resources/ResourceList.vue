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
        <p class="text-lg font-medium">Failed to load resources</p>
        <p class="text-sm text-gray-600 mt-1">{{ error }}</p>
      </div>
      <button @click="$emit('retry')" class="btn-primary">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="resources.length === 0" class="text-center py-12">
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
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Resources Yet</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Add resources to this pillar to build your content library. You can add text, URLs,
        YouTube videos, PDFs, or audio recordings.
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <button @click="$emit('addText')" class="btn-primary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Text
        </button>
        <button @click="$emit('addURL')" class="btn-secondary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Add URL
        </button>
        <button @click="$emit('addPDF')" class="btn-secondary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Upload PDF
        </button>
        <button @click="$emit('addAudio')" class="btn-secondary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Record Audio
        </button>
      </div>
    </div>

    <!-- Resource Grid -->
    <div v-else>
      <!-- Header with count and add buttons -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Resources</h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ resources.length }} resource{{ resources.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="$emit('addText')" class="btn-primary text-sm">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Resource
          </button>
        </div>
      </div>

      <!-- Grid of resource cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResourceCard
          v-for="resource in resources"
          :key="resource.id"
          :resource="resource"
          @delete="$emit('delete', resource)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ResourceCard from './ResourceCard.vue'
import type { Resource } from '@/lib/supabase'

interface Props {
  resources: Resource[]
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'addText'): void
  (e: 'addURL'): void
  (e: 'addPDF'): void
  (e: 'addAudio'): void
  (e: 'delete', resource: Resource): void
  (e: 'retry'): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

defineEmits<Emits>()
</script>
