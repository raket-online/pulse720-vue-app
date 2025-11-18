<template>
  <Modal
    :model-value="modelValue"
    :title="content?.title || 'Content'"
    size="large"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div v-if="content" class="space-y-4">
      <!-- Type Badge and Date -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200">
        <span :class="getTypeClass(content.type)" class="px-3 py-1 rounded text-sm font-medium">
          {{ content.type.toUpperCase() }}
        </span>
        <span class="text-sm text-gray-500">
          {{ formatDate(content.added_at) }}
        </span>
      </div>

      <!-- Hook -->
      <div v-if="content.hook" class="p-4 bg-blue-50 border-l-4 border-blue-400">
        <p class="text-sm font-medium text-gray-700">
          {{ content.hook }}
        </p>
      </div>

      <!-- Main Content -->
      <div class="prose prose-sm max-w-none">
        <div class="whitespace-pre-wrap text-gray-800">{{ content.content }}</div>
      </div>

      <!-- Keywords -->
      <div v-if="content.keywords" class="pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Keywords:</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="keyword in getKeywords(content.keywords)"
            :key="keyword"
            class="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
          >
            {{ keyword }}
          </span>
        </div>
      </div>

      <!-- Visual Description -->
      <div v-if="content.visual_description" class="pt-4 border-t border-gray-200">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Suggested Visual:</h4>
        <p class="text-sm text-gray-600">{{ content.visual_description }}</p>
      </div>

      <!-- Stats -->
      <div
        class="pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600"
      >
        <span>{{ content.content.length }} characters</span>
        <span>{{ wordCount }} words</span>
      </div>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <button type="button" @click="handleClose" class="btn-secondary">Close</button>
      <button type="button" @click="copyToClipboard" class="btn-primary">
        <svg
          class="w-4 h-4 inline-block mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {{ copied ? 'Copied!' : 'Copy Content' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import type { Content } from '@/lib/supabase'

interface Props {
  modelValue: boolean
  content: Content | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const copied = ref(false)

const wordCount = computed(() => {
  if (!props.content) return 0
  return props.content.content.split(/\s+/).filter((word) => word.length > 0).length
})

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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getKeywords(keywords: string | null): string[] {
  if (!keywords) return []
  return keywords
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 0)
}

async function copyToClipboard() {
  if (!props.content) return

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

function handleClose() {
  emit('close')
}
</script>
