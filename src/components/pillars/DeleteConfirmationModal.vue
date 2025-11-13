<template>
  <Modal
    :model-value="modelValue"
    title="Delete Pillar"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('close')"
  >
    <div class="space-y-4">
      <!-- Warning Icon -->
      <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <!-- Warning Message -->
      <div class="text-center">
        <p class="text-gray-900 font-medium mb-2">
          Are you sure you want to delete this pillar?
        </p>
        <p v-if="pillar" class="text-sm text-gray-600 mb-3">
          "<span class="font-semibold">{{ pillar.title }}</span>"
        </p>
        <p class="text-sm text-red-600">
          This action cannot be undone. All associated resources and content will also be deleted.
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <button
        type="button"
        @click="$emit('close')"
        class="btn-secondary"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="handleDelete"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        :disabled="loading"
      >
        <span v-if="loading">Deleting...</span>
        <span v-else>Delete Pillar</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
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
  (e: 'confirm', id: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const emit = defineEmits<Emits>()

function handleDelete() {
  if (props.pillar) {
    emit('confirm', props.pillar.id)
  }
}
</script>
