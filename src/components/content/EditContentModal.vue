<template>
  <Modal
    :model-value="modelValue"
    title="Edit Content"
    size="large"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Type Badge -->
      <div v-if="content">
        <span :class="getTypeClass(content.type)" class="px-3 py-1 rounded text-sm font-medium">
          {{ content.type.toUpperCase() }}
        </span>
      </div>

      <!-- Title -->
      <div>
        <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-1">
          Title
          <span class="text-red-500">*</span>
        </label>
        <input
          id="edit-title"
          v-model="form.title"
          type="text"
          required
          class="input-field"
          :disabled="loading"
          placeholder="Enter content title..."
        />
      </div>

      <!-- Hook -->
      <div>
        <label for="edit-hook" class="block text-sm font-medium text-gray-700 mb-1">
          Hook / Opening Line
        </label>
        <input
          id="edit-hook"
          v-model="form.hook"
          type="text"
          class="input-field"
          :disabled="loading"
          placeholder="Optional attention-grabbing opening..."
        />
      </div>

      <!-- Content -->
      <div>
        <label for="edit-content" class="block text-sm font-medium text-gray-700 mb-1">
          Content
          <span class="text-red-500">*</span>
        </label>
        <textarea
          id="edit-content"
          v-model="form.content"
          rows="12"
          required
          class="input-field resize-none font-mono text-sm"
          :disabled="loading"
          placeholder="Enter your content..."
        ></textarea>
        <div class="flex items-center justify-between mt-1">
          <p class="text-xs text-gray-500">
            {{ form.content.length }} characters, {{ wordCount }} words
          </p>
        </div>
      </div>

      <!-- Keywords -->
      <div>
        <label for="edit-keywords" class="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>
        <input
          id="edit-keywords"
          v-model="form.keywords"
          type="text"
          class="input-field"
          :disabled="loading"
          placeholder="keyword1, keyword2, keyword3..."
        />
        <p class="text-xs text-gray-500 mt-1">Comma-separated keywords for better organization</p>
      </div>

      <!-- Visual Description -->
      <div>
        <label for="edit-visual" class="block text-sm font-medium text-gray-700 mb-1">
          Visual Description
        </label>
        <textarea
          id="edit-visual"
          v-model="form.visual_description"
          rows="2"
          class="input-field resize-none"
          :disabled="loading"
          placeholder="Description of suggested visual or image..."
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>
    </form>

    <!-- Footer Buttons -->
    <template #footer>
      <button type="button" @click="handleClose" class="btn-secondary" :disabled="loading">
        Cancel
      </button>
      <button
        type="submit"
        @click="handleSubmit"
        class="btn-primary"
        :disabled="loading || !isValid"
      >
        <span v-if="loading">Saving...</span>
        <span v-else>Save Changes</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import type { Content } from '@/lib/supabase'

interface Props {
  modelValue: boolean
  content: Content | null
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (
    e: 'submit',
    data: {
      title: string
      content: string
      hook?: string
      keywords?: string
      visual_description?: string
    }
  ): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<Emits>()

const form = ref({
  title: '',
  content: '',
  hook: '',
  keywords: '',
  visual_description: '',
})

const wordCount = computed(() => {
  return form.value.content.split(/\s+/).filter((word) => word.length > 0).length
})

const isValid = computed(() => {
  return form.value.title.trim().length > 0 && form.value.content.trim().length >= 10
})

// Initialize form when content changes
watch(
  () => props.content,
  (newContent) => {
    if (newContent) {
      form.value = {
        title: newContent.title || '',
        content: newContent.content || '',
        hook: newContent.hook || '',
        keywords: newContent.keywords || '',
        visual_description: newContent.visual_description || '',
      }
    }
  },
  { immediate: true }
)

// Reset form when modal closes
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      // Modal closed, reset form on next open
    }
  }
)

function getTypeClass(type: string): string {
  const classes: Record<string, string> = {
    linkedin: 'bg-blue-100 text-blue-800',
    twitter: 'bg-sky-100 text-sky-800',
    instagram: 'bg-pink-100 text-pink-800',
    blog: 'bg-purple-100 text-purple-800',
    email: 'bg-green-100 text-green-800',
  }
  return classes[type?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

function handleSubmit() {
  if (isValid.value) {
    emit('submit', {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      hook: form.value.hook.trim() || undefined,
      keywords: form.value.keywords.trim() || undefined,
      visual_description: form.value.visual_description.trim() || undefined,
    })
  }
}

function handleClose() {
  emit('close')
}
</script>
