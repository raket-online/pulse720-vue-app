<template>
  <Modal
    :model-value="modelValue"
    title="Add URL or YouTube Video"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="resource-url" class="block text-sm font-medium text-gray-700 mb-1">
            URL <span class="text-red-500">*</span>
          </label>
          <input
            id="resource-url"
            v-model="url"
            type="url"
            required
            class="input-field"
            placeholder="https://example.com or https://youtube.com/watch?v=..."
            :disabled="loading"
          />
          <p class="text-xs text-gray-500 mt-1">
            Enter a webpage URL or YouTube video link
          </p>
        </div>

        <!-- YouTube Detection -->
        <div v-if="isYouTubeURL" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-blue-800">
              <p class="font-medium">YouTube video detected</p>
              <p class="mt-1">We'll extract the transcript from this video.</p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Processing Status -->
        <div v-if="loading" class="p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span class="text-sm text-primary-800">
              {{ isYouTubeURL ? 'Extracting transcript...' : 'Crawling webpage...' }}
            </span>
          </div>
        </div>
      </div>
    </form>

    <!-- Footer Buttons -->
    <template #footer>
      <button
        type="button"
        @click="handleClose"
        class="btn-secondary"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="submit"
        @click="handleSubmit"
        class="btn-primary"
        :disabled="loading || !isValidURL"
      >
        <span v-if="loading">Processing...</span>
        <span v-else>Add from URL</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/shared/Modal.vue'

interface Props {
  modelValue: boolean
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', url: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const emit = defineEmits<Emits>()

const url = ref('')

const isYouTubeURL = computed(() => {
  return url.value.includes('youtube.com') || url.value.includes('youtu.be')
})

const isValidURL = computed(() => {
  try {
    if (!url.value) return false
    new URL(url.value)
    return true
  } catch {
    return false
  }
})

// Reset form when modal opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    url.value = ''
  }
})

function handleSubmit() {
  if (isValidURL.value) {
    emit('submit', url.value.trim())
  }
}

function handleClose() {
  emit('close')
}
</script>
