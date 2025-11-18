<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">User Profile Settings</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Company Information Section -->
        <div class="border-b border-gray-200 pb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>

          <div class="space-y-4">
            <!-- Company Name -->
            <div>
              <label for="company-name" class="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                id="company-name"
                v-model="form.company_name"
                type="text"
                class="input-field"
                :disabled="loading"
                placeholder="Your company name..."
              />
            </div>

            <!-- Company Website -->
            <div>
              <label for="company-website" class="block text-sm font-medium text-gray-700 mb-1">
                Company Website
              </label>
              <input
                id="company-website"
                v-model="form.company_website"
                type="url"
                class="input-field"
                :disabled="loading"
                placeholder="https://example.com"
              />
            </div>

            <!-- Logo URL -->
            <div>
              <label for="logo-url" class="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                id="logo-url"
                v-model="form.logo_url"
                type="url"
                class="input-field"
                :disabled="loading"
                placeholder="https://example.com/logo.png"
              />
              <p class="text-xs text-gray-500 mt-1">URL to your company logo for branding</p>
            </div>
          </div>
        </div>

        <!-- Content Settings Section -->
        <div class="border-b border-gray-200 pb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Content Settings</h3>

          <div class="space-y-4">
            <!-- Target Audience -->
            <div>
              <label for="target-audience" class="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <textarea
                id="target-audience"
                v-model="form.target_audience"
                rows="3"
                class="input-field resize-none"
                :disabled="loading"
                placeholder="Describe your target audience (e.g., B2B SaaS companies, tech startups, marketing professionals...)"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">This helps AI generate more targeted content</p>
            </div>

            <!-- Output Language -->
            <div>
              <label for="output-language" class="block text-sm font-medium text-gray-700 mb-1">
                Output Language
              </label>
              <select
                id="output-language"
                v-model="form.output_language"
                class="input-field"
                :disabled="loading"
              >
                <option value="en">English</option>
                <option value="nl">Nederlands (Dutch)</option>
                <option value="de">Deutsch (German)</option>
                <option value="fr">Français (French)</option>
                <option value="es">Español (Spanish)</option>
                <option value="it">Italiano (Italian)</option>
                <option value="pt">Português (Portuguese)</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Language for generated content</p>
            </div>
          </div>
        </div>

        <!-- Account Information Section -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>

          <div class="space-y-4">
            <!-- User ID (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input type="text" :value="userId" class="input-field bg-gray-50" disabled readonly />
            </div>

            <!-- Superuser Status (Read-only) -->
            <div v-if="superuser" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span class="text-sm font-medium text-blue-800">Superuser Account</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex items-center justify-center gap-3">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <span class="text-sm text-gray-700">Saving settings...</span>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {{ error }}
        </div>

        <!-- Success Message -->
        <div
          v-if="success"
          class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
        >
          Settings saved successfully!
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 pt-4">
          <button type="submit" class="btn-primary" :disabled="loading || !hasChanges">
            <span v-if="loading">Saving...</span>
            <span v-else>Save Settings</span>
          </button>
          <button
            type="button"
            @click="handleReset"
            class="btn-secondary"
            :disabled="loading || !hasChanges"
          >
            Reset Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { UserProfile } from '@/lib/supabase'

interface Props {
  userId: string
  profile: UserProfile | null
  superuser?: boolean
  loading?: boolean
  error?: string | null
  success?: boolean
}

interface Emits {
  (
    e: 'submit',
    data: {
      company_name?: string
      company_website?: string
      logo_url?: string
      target_audience?: string
      output_language?: string
    }
  ): void
}

const props = withDefaults(defineProps<Props>(), {
  superuser: false,
  loading: false,
  error: null,
  success: false,
})

const emit = defineEmits<Emits>()

const form = ref({
  company_name: '',
  company_website: '',
  logo_url: '',
  target_audience: '',
  output_language: 'en',
})

const initialForm = ref({ ...form.value })

const hasChanges = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(initialForm.value)
})

// Initialize form with profile data
watch(
  () => props.profile,
  (newProfile) => {
    if (newProfile) {
      form.value = {
        company_name: newProfile.company_name || '',
        company_website: newProfile.company_website || '',
        logo_url: newProfile.logo_url || '',
        target_audience: newProfile.target_audience || '',
        output_language: newProfile.output_language || 'en',
      }
      initialForm.value = { ...form.value }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  const updates: Record<string, string | undefined> = {}

  if (form.value.company_name.trim()) {
    updates.company_name = form.value.company_name.trim()
  }

  if (form.value.company_website.trim()) {
    updates.company_website = form.value.company_website.trim()
  }

  if (form.value.logo_url.trim()) {
    updates.logo_url = form.value.logo_url.trim()
  }

  if (form.value.target_audience.trim()) {
    updates.target_audience = form.value.target_audience.trim()
  }

  if (form.value.output_language) {
    updates.output_language = form.value.output_language
  }

  emit('submit', updates)
  initialForm.value = { ...form.value }
}

function handleReset() {
  form.value = { ...initialForm.value }
}
</script>
