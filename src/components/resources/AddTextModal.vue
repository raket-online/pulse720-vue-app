<template>
  <Modal
    :model-value="modelValue"
    title="Add Text Resource"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="resource-title" class="block text-sm font-medium text-gray-700 mb-1">
            Title
            <span class="text-red-500">*</span>
          </label>
          <input
            id="resource-title"
            v-model="form.title"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Market Research Findings, Customer Interview Notes"
            :disabled="loading"
            maxlength="200"
          />
        </div>

        <div>
          <label for="resource-content" class="block text-sm font-medium text-gray-700 mb-1">
            Content
            <span class="text-red-500">*</span>
          </label>
          <textarea
            id="resource-content"
            v-model="form.content"
            required
            rows="10"
            class="input-field resize-none"
            placeholder="Paste or type your content here... (minimum 50 characters)"
            :disabled="loading"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ form.content.length }} characters
            <span v-if="form.content.length < 50" class="text-orange-600">
              ({{ 50 - form.content.length }} more needed)
            </span>
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
        <span v-if="loading">Adding Resource...</span>
        <span v-else>Add Resource</span>
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
  (e: 'submit', data: { title: string; content: string }): void
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
})

const isValid = computed(() => {
  return form.value.title.trim().length > 0 && form.value.content.trim().length >= 50
})

// Reset form when modal opens
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      form.value = {
        title: '',
        content: '',
      }
    }
  }
)

function handleSubmit() {
  if (isValid.value) {
    emit('submit', {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
    })
  }
}

function handleClose() {
  emit('close')
}
</script>
