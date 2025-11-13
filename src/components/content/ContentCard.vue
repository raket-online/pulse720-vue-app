<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span :class="getTypeClass(content.type)" class="px-2 py-1 rounded text-xs font-medium">
            {{ content.type.toUpperCase() }}
          </span>
          <span class="text-xs text-gray-500">
            {{ formatDate(content.added_at) }}
          </span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          {{ content.title }}
        </h3>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 ml-4">
        <button
          @click="$emit('view', content)"
          class="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
          title="View content"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button
          @click="$emit('edit', content)"
          class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Edit content"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', content)"
          class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete content"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Hook -->
    <div v-if="content.hook" class="mb-3">
      <p class="text-sm font-medium text-gray-700 italic">
        "{{ content.hook }}"
      </p>
    </div>

    <!-- Content Preview -->
    <div class="mb-4">
      <p class="text-sm text-gray-600 line-clamp-3">
        {{ content.content }}
      </p>
    </div>

    <!-- Keywords -->
    <div v-if="content.keywords" class="mb-4">
      <div class="flex flex-wrap gap-1">
        <span
          v-for="keyword in getKeywords(content.keywords)"
          :key="keyword"
          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
        >
          {{ keyword }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="text-xs text-gray-500">
        {{ content.content.length }} characters
      </div>
      <button
        @click="copyToClipboard"
        class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Content } from '@/lib/supabase'

interface Props {
  content: Content
}

interface Emits {
  (e: 'view', content: Content): void
  (e: 'edit', content: Content): void
  (e: 'delete', content: Content): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const copied = ref(false)

function getTypeClass(type: string): string {
  const classes: Record<string, string> = {
    linkedin: 'bg-blue-100 text-blue-800',
    twitter: 'bg-sky-100 text-sky-800',
    instagram: 'bg-pink-100 text-pink-800',
    blog: 'bg-purple-100 text-purple-800',
    email: 'bg-green-100 text-green-800',
  }
  return classes[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

function getKeywords(keywords: string | null): string[] {
  if (!keywords) return []
  return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 5)
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.content.content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
