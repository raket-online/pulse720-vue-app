<template>
  <Modal
    :model-value="modelValue"
    title="Upload PDF Document"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="space-y-4">
      <!-- File Upload Area -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          PDF File
          <span class="text-red-500">*</span>
        </label>
        <div
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400',
          ]"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,application/pdf"
            @change="handleFileSelect"
            class="hidden"
            :disabled="loading"
          />

          <div v-if="!selectedFile">
            <svg
              class="w-12 h-12 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p class="text-sm text-gray-600 mb-1">
              <span class="font-medium text-primary-600">Click to upload</span>
              or drag and drop
            </p>
            <p class="text-xs text-gray-500">PDF files only (max 10MB)</p>
          </div>

          <div v-else class="flex items-center justify-center gap-3">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
            <button
              type="button"
              @click.stop="clearFile"
              class="p-1 hover:bg-gray-100 rounded"
              :disabled="loading"
            >
              <svg
                class="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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
          <span class="text-sm text-primary-800">Extracting text from PDF...</span>
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <button type="button" @click="handleClose" class="btn-secondary" :disabled="loading">
        Cancel
      </button>
      <button
        type="button"
        @click="handleSubmit"
        class="btn-primary"
        :disabled="loading || !selectedFile"
      >
        <span v-if="loading">Processing...</span>
        <span v-else>Upload PDF</span>
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
  (e: 'submit', data: { file: File; base64: string }): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)

// Reset form when modal opens
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }
)

function triggerFileInput() {
  if (!props.loading) {
    fileInput.value?.click()
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

function validateAndSetFile(file: File) {
  // Validate file type
  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    emit('update:modelValue', true) // Keep modal open
    return
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    emit('update:modelValue', true) // Keep modal open
    return
  }

  selectedFile.value = file
}

function clearFile() {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  if (!selectedFile.value) return

  try {
    // Convert file to base64
    const base64 = await fileToBase64(selectedFile.value)
    emit('submit', {
      file: selectedFile.value,
      base64,
    })
  } catch (err) {
    console.error('Error reading file:', err)
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:application/pdf;base64, prefix
      const base64 = result.split(',')[1]
      if (!base64) {
        reject(new Error('Failed to convert file to base64'))
        return
      }
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function handleClose() {
  emit('close')
}
</script>
