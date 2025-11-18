<template>
  <Modal
    :model-value="modelValue"
    title="Generate Content"
    size="large"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- Pillar Selection -->
        <div>
          <label for="pillar-select" class="block text-sm font-medium text-gray-700 mb-1">
            Select Pillar
            <span class="text-red-500">*</span>
          </label>
          <select
            id="pillar-select"
            v-model="form.pillarId"
            required
            class="input-field"
            :disabled="loading || !!selectedPillar"
            @change="handlePillarChange"
          >
            <option value="">Choose a pillar...</option>
            <option v-for="pillar in pillars" :key="pillar.id" :value="pillar.id">
              {{ pillar.title }} ({{ pillar.score || 0 }}/10)
            </option>
          </select>
          <p v-if="form.pillarId && resourceCount > 0" class="text-xs text-gray-600 mt-1">
            This pillar has {{ resourceCount }} resource{{ resourceCount !== 1 ? 's' : '' }}
          </p>
          <p v-else-if="form.pillarId && resourceCount === 0" class="text-xs text-orange-600 mt-1">
            ⚠️ This pillar has no resources. Add resources first for better content quality.
          </p>
        </div>

        <!-- Content Type -->
        <div>
          <label for="content-type" class="block text-sm font-medium text-gray-700 mb-1">
            Content Type
            <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              v-for="type in contentTypes"
              :key="type.value"
              type="button"
              @click="form.contentType = type.value"
              :class="[
                'p-4 rounded-lg border-2 transition-all text-left',
                form.contentType === type.value
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300',
              ]"
              :disabled="loading"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">{{ type.icon }}</span>
                <span class="font-medium text-gray-900">{{ type.label }}</span>
              </div>
              <p class="text-xs text-gray-600">{{ type.description }}</p>
            </button>
          </div>
        </div>

        <!-- Additional Instructions -->
        <div>
          <label for="instructions" class="block text-sm font-medium text-gray-700 mb-1">
            Additional Instructions (Optional)
          </label>
          <textarea
            id="instructions"
            v-model="form.instructions"
            rows="3"
            class="input-field resize-none"
            placeholder="e.g., Focus on beginner-friendly tips, include statistics, use a casual tone..."
            :disabled="loading"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Provide specific guidance for the AI to customize the content to your needs.
          </p>
        </div>

        <!-- Preview Mode Info -->
        <div v-if="!loading" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start gap-2">
            <svg
              class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="text-sm text-blue-800">
              <p class="font-medium">AI will generate unique content based on:</p>
              <ul class="list-disc list-inside mt-1 space-y-1">
                <li>Your pillar's resources and context</li>
                <li>Selected content type best practices</li>
                <li>Your additional instructions</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex items-center justify-center gap-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span class="text-sm text-gray-700">Generating content with AI...</span>
          </div>
          <p class="text-xs text-gray-600 text-center mt-2">
            This may take 10-30 seconds depending on the content length.
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {{ error }}
        </div>
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
        <span v-if="loading">Generating...</span>
        <span v-else>Generate Content</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import type { Pillar } from '@/lib/supabase'

interface Props {
  modelValue: boolean
  pillars: Pillar[]
  selectedPillar?: Pillar | null
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: { pillarId: string; contentType: string; instructions: string }): void
  (e: 'close'): void
  (e: 'pillarChange', pillarId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  selectedPillar: null,
})

const emit = defineEmits<Emits>()

const form = ref({
  pillarId: '',
  contentType: 'linkedin',
  instructions: '',
})

const resourceCount = ref(0)

const contentTypes = [
  {
    value: 'linkedin',
    label: 'LinkedIn',
    icon: '💼',
    description: 'Professional posts, 150-300 words',
  },
  {
    value: 'twitter',
    label: 'Twitter',
    icon: '🐦',
    description: 'Thread with 3-5 tweets',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    icon: '📸',
    description: 'Caption with hashtags',
  },
  {
    value: 'blog',
    label: 'Blog Post',
    icon: '📝',
    description: 'Long-form 500-800 words',
  },
  {
    value: 'email',
    label: 'Email',
    icon: '✉️',
    description: 'Newsletter format',
  },
]

const isValid = computed(() => {
  return form.value.pillarId && form.value.contentType
})

// Initialize with selected pillar if provided
watch(
  () => props.selectedPillar,
  (newPillar) => {
    if (newPillar) {
      form.value.pillarId = newPillar.id
    }
  },
  { immediate: true }
)

// Reset form when modal opens
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      if (!props.selectedPillar) {
        form.value = {
          pillarId: '',
          contentType: 'linkedin',
          instructions: '',
        }
        resourceCount.value = 0
      }
    }
  }
)

function handlePillarChange() {
  emit('pillarChange', form.value.pillarId)
}

function handleSubmit() {
  if (isValid.value) {
    emit('submit', {
      pillarId: form.value.pillarId,
      contentType: form.value.contentType,
      instructions: form.value.instructions,
    })
  }
}

function handleClose() {
  emit('close')
}

// Expose method to set resource count from parent
defineExpose({
  setResourceCount(count: number) {
    resourceCount.value = count
  },
})
</script>
