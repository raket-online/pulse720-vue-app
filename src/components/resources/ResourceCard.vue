<template>
  <div class="card hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 truncate">
          {{ resource.title }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          Added {{ formatDate(resource.added_at) }}
        </p>
      </div>

      <!-- Delete Button -->
      <button
        @click="$emit('delete', resource)"
        class="ml-3 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Delete resource"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>

    <!-- Content Preview -->
    <p class="text-sm text-gray-600 line-clamp-3 mb-4">
      {{ resource.content }}
    </p>

    <!-- Score and Advice -->
    <div v-if="resource.score !== null || resource.advice" class="pt-4 border-t border-gray-100">
      <div v-if="resource.score !== null" class="flex items-center gap-2 mb-2">
        <span class="text-sm font-medium text-gray-700">Score:</span>
        <div
          class="px-2 py-1 rounded text-sm font-semibold"
          :class="getScoreColor(resource.score)"
        >
          {{ resource.score }}/10
        </div>
      </div>
      <div v-if="resource.advice" class="text-sm text-gray-600 line-clamp-2">
        <span class="font-medium">Advice:</span> {{ resource.advice }}
      </div>
    </div>

    <!-- File Info (if applicable) -->
    <div v-if="resource.filename" class="mt-3 pt-3 border-t border-gray-100">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        <span class="truncate">{{ resource.filename }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Resource } from '@/lib/supabase'

interface Props {
  resource: Resource
}

interface Emits {
  (e: 'delete', resource: Resource): void
}

defineProps<Props>()
defineEmits<Emits>()

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'today'
  } else if (diffDays === 1) {
    return 'yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}

function getScoreColor(score: number): string {
  if (score >= 8) {
    return 'bg-green-100 text-green-800'
  } else if (score >= 6) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (score >= 4) {
    return 'bg-orange-100 text-orange-800'
  } else {
    return 'bg-red-100 text-red-800'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
