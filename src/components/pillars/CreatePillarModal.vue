<template>
  <Modal
    :model-value="modelValue"
    title="Create New Pillar"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="pillar-title" class="block text-sm font-medium text-gray-700 mb-1">
            Pillar Title
            <span class="text-red-500">*</span>
          </label>
          <input
            id="pillar-title"
            v-model="title"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Digital Marketing, Product Development, Customer Success"
            :disabled="loading"
            maxlength="100"
          />
          <p class="text-xs text-gray-500 mt-1">
            Choose a clear, descriptive name for your content pillar
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
        :disabled="loading || !title.trim()"
      >
        <span v-if="loading">Creating...</span>
        <span v-else>Create Pillar</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/shared/Modal.vue'

interface Props {
  modelValue: boolean
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', title: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<Emits>()

const title = ref('')

// Reset form when modal opens
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      title.value = ''
    }
  }
)

function handleSubmit() {
  if (title.value.trim()) {
    emit('submit', title.value.trim())
  }
}

function handleClose() {
  title.value = ''
  emit('close')
}
</script>
