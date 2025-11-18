<template>
  <div
    class="card hover:shadow-lg transition-shadow cursor-pointer group"
    :class="{ 'ring-2 ring-primary-500': isSelected }"
    @click="handleSelect"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <h3
          class="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors"
        >
          {{ pillar.title }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">Updated {{ formatDate(pillar.last_updated) }}</p>
      </div>

      <!-- Actions Menu -->
      <div class="flex items-center gap-2 ml-3" @click.stop>
        <button
          @click="$emit('edit', pillar)"
          class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
          title="Edit pillar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          @click="$emit('delete', pillar)"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete pillar"
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
    </div>

    <!-- Score and Advice (if available) -->
    <div v-if="pillar.score !== null || pillar.advice" class="mt-4 pt-4 border-t border-gray-100">
      <div v-if="pillar.score !== null" class="flex items-center gap-2 mb-2">
        <span class="text-sm font-medium text-gray-700">Score:</span>
        <div class="flex items-center gap-1">
          <div class="px-2 py-1 rounded text-sm font-semibold" :class="getScoreColor(pillar.score)">
            {{ pillar.score }}/10
          </div>
        </div>
      </div>
      <div v-if="pillar.advice" class="text-sm text-gray-600 line-clamp-2">
        {{ pillar.advice }}
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-sm text-gray-500 italic">No resources added yet</div>
  </div>
</template>

<script setup lang="ts">
import type { Pillar } from '@/lib/supabase'

interface Props {
  pillar: Pillar
  isSelected?: boolean
}

interface Emits {
  (e: 'select', pillar: Pillar): void
  (e: 'edit', pillar: Pillar): void
  (e: 'delete', pillar: Pillar): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
})

const emit = defineEmits<Emits>()

function handleSelect() {
  emit('select', props.pillar)
}

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
</style>
