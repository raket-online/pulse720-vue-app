<template>
  <Modal
    :model-value="modelValue"
    title="Edit Pillar"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="edit-pillar-title" class="block text-sm font-medium text-gray-700 mb-1">
            Pillar Title
            <span class="text-red-500">*</span>
          </label>
          <input
            id="edit-pillar-title"
            v-model="title"
            type="text"
            required
            class="input-field"
            placeholder="Enter pillar title"
            :disabled="loading"
            maxlength="100"
          />
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
        :disabled="loading || !title.trim() || title === pillar?.title"
      >
        <span v-if="loading">Saving...</span>
        <span v-else>Save Changes</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import type { Pillar } from '@/lib/supabase'

interface Props {
  modelValue: boolean
  pillar: Pillar | null
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', id: string, title: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<Emits>()

const title = ref('')

// Initialize form when pillar changes
watch(
  () => props.pillar,
  (newPillar) => {
    if (newPillar) {
      title.value = newPillar.title
    }
  },
  { immediate: true }
)

// Reset form when modal closes
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      title.value = ''
    } else if (props.pillar) {
      title.value = props.pillar.title
    }
  }
)

function handleSubmit() {
  if (props.pillar && title.value.trim() && title.value !== props.pillar.title) {
    emit('submit', props.pillar.id, title.value.trim())
  }
}

function handleClose() {
  emit('close')
}
</script>
