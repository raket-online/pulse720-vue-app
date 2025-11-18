<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-[#0A66C2] rounded flex items-center justify-center">
          <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">LinkedIn</h3>
          <p class="text-sm text-gray-600">
            {{
              linkedInProfile
                ? 'Connected'
                : 'Connect your LinkedIn account to post content directly'
            }}
          </p>
        </div>
      </div>

      <!-- Connection Status Badge -->
      <div v-if="linkedInProfile">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Connected
        </span>
      </div>
    </div>

    <!-- Connected State -->
    <div v-if="linkedInProfile" class="space-y-4">
      <!-- Profile Info -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{
                linkedInProfile.profile_data?.name ||
                linkedInProfile.profile_data?.given_name ||
                'LinkedIn User'
              }}
            </p>
            <p v-if="linkedInProfile.profile_data?.email" class="text-sm text-gray-600 mt-1">
              {{ linkedInProfile.profile_data.email }}
            </p>
            <p class="text-xs text-gray-500 mt-2">
              Connected {{ formatDate(linkedInProfile.connected_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Token Status -->
      <div v-if="isTokenExpired" class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-start gap-2">
          <svg
            class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div class="text-sm">
            <p class="font-medium text-yellow-800">Connection Expired</p>
            <p class="text-yellow-700 mt-1">
              Your LinkedIn connection has expired. Please reconnect to continue posting.
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-2">
        <button
          v-if="isTokenExpired"
          @click="handleConnect"
          class="btn-primary text-sm"
          :disabled="loading"
        >
          <span v-if="loading">Reconnecting...</span>
          <span v-else>Reconnect LinkedIn</span>
        </button>
        <button @click="handleDisconnect" class="btn-secondary text-sm" :disabled="loading">
          Disconnect
        </button>
      </div>
    </div>

    <!-- Not Connected State -->
    <div v-else class="space-y-4">
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
            <p class="font-medium">Connect your LinkedIn account to:</p>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li>Post generated content directly to your LinkedIn profile</li>
              <li>Save time with one-click publishing</li>
              <li>Track your posted content</li>
            </ul>
          </div>
        </div>
      </div>

      <button @click="handleConnect" class="btn-primary" :disabled="loading">
        <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
        <span v-if="loading">Connecting...</span>
        <span v-else>Connect LinkedIn Account</span>
      </button>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
    >
      {{ error }}
    </div>

    <!-- Success Message -->
    <div
      v-if="success"
      class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
    >
      {{ success }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LinkedInProfile } from '@/services/linkedin'

interface Props {
  userId: string
  linkedInProfile: LinkedInProfile | null
  loading?: boolean
  error?: string | null
  success?: string | null
}

interface Emits {
  (e: 'connect'): void
  (e: 'disconnect'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  success: null,
})

const emit = defineEmits<Emits>()

const isTokenExpired = computed(() => {
  if (!props.linkedInProfile?.expires_at) return false
  return new Date(props.linkedInProfile.expires_at) <= new Date()
})

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function handleConnect() {
  emit('connect')
}

function handleDisconnect() {
  if (confirm('Are you sure you want to disconnect your LinkedIn account?')) {
    emit('disconnect')
  }
}
</script>
