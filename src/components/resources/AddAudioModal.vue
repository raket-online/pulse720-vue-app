<template>
  <Modal
    :model-value="modelValue"
    title="Record Audio"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <div class="space-y-4">
      <!-- Recording Status -->
      <div class="text-center py-6">
        <div class="relative inline-block">
          <div
            :class="[
              'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors',
              isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
            ]"
          >
            <svg
              :class="['w-12 h-12', isRecording ? 'text-red-600' : 'text-gray-600']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <div
            v-if="isRecording"
            class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full"
          >
            Recording {{ recordingTime }}
          </div>
        </div>

        <p v-if="!isRecording && !transcript" class="text-gray-600">
          Click Start Recording to begin
        </p>
        <p v-else-if="isRecording" class="text-gray-600">
          Speak clearly into your microphone
        </p>
      </div>

      <!-- Real-time Transcript -->
      <div v-if="currentTranscript || transcript" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Transcript {{ isRecording ? '(Live)' : '' }}
        </label>
        <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[120px] max-h-[240px] overflow-y-auto">
          <p v-if="transcript || currentTranscript" class="text-sm text-gray-900 whitespace-pre-wrap">
            {{ transcript || currentTranscript }}
          </p>
          <p v-else class="text-sm text-gray-500 italic">
            Transcript will appear here as you speak...
          </p>
        </div>
        <p class="text-xs text-gray-500">
          {{ (transcript || currentTranscript).length }} characters
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- Instructions -->
      <div v-if="!isRecording && !transcript" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-blue-800">
            <p class="font-medium">Recording Tips:</p>
            <ul class="mt-1 ml-4 list-disc space-y-1">
              <li>Speak clearly and at a moderate pace</li>
              <li>Minimize background noise</li>
              <li>Wait 1-2 seconds after clicking Start</li>
              <li>Click Stop when finished speaking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <button
        type="button"
        @click="handleClose"
        class="btn-secondary"
        :disabled="isRecording"
      >
        {{ transcript ? 'Discard' : 'Cancel' }}
      </button>

      <button
        v-if="!isRecording && !transcript"
        type="button"
        @click="startRecording"
        class="btn-primary"
        :disabled="loading"
      >
        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        Start Recording
      </button>

      <button
        v-if="isRecording"
        type="button"
        @click="stopRecording"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        Stop Recording
      </button>

      <button
        v-if="!isRecording && transcript"
        type="button"
        @click="handleSubmit"
        class="btn-primary"
        :disabled="loading || transcript.trim().length < 50"
      >
        <span v-if="loading">Adding Resource...</span>
        <span v-else>Add Transcript</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import Modal from '@/components/shared/Modal.vue'

interface Props {
  modelValue: boolean
  loading?: boolean
  error?: string | null
  deepgramApiKey?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', transcript: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  deepgramApiKey: import.meta.env.VITE_DEEPGRAM_API_KEY || ''
})

const emit = defineEmits<Emits>()

const isRecording = ref(false)
const currentTranscript = ref('')
const transcript = ref('')
const recordingTime = ref('0:00')
const localError = ref<string | null>(null)

let audioStream: MediaStream | null = null
let deepgramSocket: WebSocket | null = null
let recordingInterval: ReturnType<typeof setInterval> | null = null
let recordingStartTime = 0

// Reset state when modal opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    isRecording.value = false
    currentTranscript.value = ''
    transcript.value = ''
    recordingTime.value = '0:00'
    localError.value = null
  } else {
    cleanup()
  }
})

async function startRecording() {
  try {
    localError.value = null

    // Request microphone access
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Initialize Deepgram WebSocket
    const apiKey = props.deepgramApiKey
    if (!apiKey) {
      throw new Error('Deepgram API key not configured. Please add VITE_DEEPGRAM_API_KEY to your .env file.')
    }

    deepgramSocket = new WebSocket(
      'wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1',
      ['token', apiKey]
    )

    deepgramSocket.onopen = () => {
      console.log('Deepgram WebSocket connected')
    }

    deepgramSocket.onmessage = (message) => {
      const data = JSON.parse(message.data)
      if (data.channel?.alternatives?.[0]?.transcript) {
        const transcriptText = data.channel.alternatives[0].transcript
        if (transcriptText.trim()) {
          currentTranscript.value += (currentTranscript.value ? ' ' : '') + transcriptText
        }
      }
    }

    deepgramSocket.onerror = (error) => {
      console.error('Deepgram WebSocket error:', error)
      localError.value = 'Transcription connection error. Please try again.'
      stopRecording()
    }

    // Set up MediaRecorder to send audio to Deepgram
    const audioContext = new AudioContext({ sampleRate: 16000 })
    const source = audioContext.createMediaStreamSource(audioStream)
    const processor = audioContext.createScriptProcessor(4096, 1, 1)

    processor.onaudioprocess = (e) => {
      if (deepgramSocket?.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0)
        // Convert float32 to int16
        const int16Data = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          int16Data[i] = Math.max(-32768, Math.min(32767, Math.floor(inputData[i]! * 32768)))
        }
        deepgramSocket.send(int16Data.buffer)
      }
    }

    source.connect(processor)
    processor.connect(audioContext.destination)

    // Start recording
    isRecording.value = true
    recordingStartTime = Date.now()

    // Update recording time
    recordingInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      recordingTime.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
    }, 1000)

  } catch (err) {
    console.error('Error starting recording:', err)
    if (err instanceof Error && err.name === 'NotAllowedError') {
      localError.value = 'Microphone access denied. Please allow microphone access and try again.'
    } else {
      localError.value = err instanceof Error ? err.message : 'Failed to start recording'
    }
    cleanup()
  }
}

function stopRecording() {
  isRecording.value = false

  // Save the current transcript
  transcript.value = currentTranscript.value
  currentTranscript.value = ''

  // Close Deepgram connection
  if (deepgramSocket && deepgramSocket.readyState === WebSocket.OPEN) {
    deepgramSocket.close()
  }
  deepgramSocket = null

  // Stop media stream
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop())
    audioStream = null
  }

  // Clear recording interval
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
}

function cleanup() {
  if (isRecording.value) {
    stopRecording()
  }
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
}

function handleSubmit() {
  if (transcript.value.trim().length >= 50) {
    emit('submit', transcript.value.trim())
  }
}

function handleClose() {
  cleanup()
  emit('close')
}

// Cleanup on component unmount
onUnmounted(() => {
  cleanup()
})
</script>
