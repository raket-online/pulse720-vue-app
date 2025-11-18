<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-2xl font-bold text-primary-600 mb-6">User Profile Settings</h2>

      <!-- Category Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex -mb-px space-x-8">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="activeCategory = category.id"
            :class="[
              'px-1 py-4 text-sm font-medium border-b-2 transition-colors',
              activeCategory === category.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            {{ category.label }}
          </button>
        </nav>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Company Category -->
        <div v-if="activeCategory === 'company'" class="space-y-4">
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

          <div>
            <label for="company-tagline" class="block text-sm font-medium text-gray-700 mb-1">
              Company Tagline
            </label>
            <input
              id="company-tagline"
              v-model="form.company_tagline"
              type="text"
              class="input-field"
              :disabled="loading"
              placeholder="Your company tagline..."
            />
          </div>

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
        </div>

        <!-- Target Audience Category -->
        <div v-if="activeCategory === 'target_audience'" class="space-y-4">
          <div>
            <label for="target-audience" class="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <textarea
              id="target-audience"
              v-model="form.target_audience"
              rows="8"
              class="input-field resize-none"
              :disabled="loading"
              placeholder="Describe your target audience (e.g., B2B SaaS companies, tech startups, marketing professionals...)"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">This helps AI generate more targeted content</p>
          </div>
        </div>

        <!-- Text Category -->
        <div v-if="activeCategory === 'text'" class="space-y-4">
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

          <div>
            <label for="signature" class="block text-sm font-medium text-gray-700 mb-1">
              Signature
            </label>
            <textarea
              id="signature"
              v-model="form.signature"
              rows="4"
              class="input-field resize-none"
              :disabled="loading"
              placeholder="Your email/content signature..."
            ></textarea>
          </div>
        </div>

        <!-- Branding Category -->
        <div v-if="activeCategory === 'branding'" class="space-y-4">
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

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="brand-primary-color" class="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <input
                id="brand-primary-color"
                v-model="form.brand_primary_color"
                type="color"
                class="h-10 w-full rounded border border-gray-300"
                :disabled="loading"
              />
            </div>

            <div>
              <label for="brand-secondary-color" class="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <input
                id="brand-secondary-color"
                v-model="form.brand_secondary_color"
                type="color"
                class="h-10 w-full rounded border border-gray-300"
                :disabled="loading"
              />
            </div>

            <div>
              <label for="brand-tertiary-color" class="block text-sm font-medium text-gray-700 mb-1">
                Tertiary Color
              </label>
              <input
                id="brand-tertiary-color"
                v-model="form.brand_tertiary_color"
                type="color"
                class="h-10 w-full rounded border border-gray-300"
                :disabled="loading"
              />
            </div>
          </div>
        </div>

        <!-- Image Category -->
        <div v-if="activeCategory === 'image'" class="space-y-4">
          <div>
            <label for="imagegen-style" class="block text-sm font-medium text-gray-700 mb-1">
              Image Generation Style
            </label>
            <select
              id="imagegen-style"
              v-model="form.imagegen_style"
              class="input-field"
              :disabled="loading"
            >
              <option value="">Select a style...</option>
              <option value="Realistic">Realistic</option>
              <option value="Digital Art">Digital Art</option>
              <option value="Claymation 3D">Claymation 3D</option>
              <option value="Anime">Anime</option>
              <option value="Watercolor">Watercolor</option>
              <option value="Oil Painting">Oil Painting</option>
              <option value="Sketch">Sketch</option>
            </select>
          </div>
        </div>

        <!-- Carousel Category -->
        <div v-if="activeCategory === 'carousel'" class="space-y-6">
          <!-- Colors Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Colors & Background</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="carousel-text-color" class="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <input
                  id="carousel-text-color"
                  v-model="form.carousel_text_color"
                  type="color"
                  class="h-10 w-full rounded border border-gray-300"
                  :disabled="loading"
                />
              </div>

              <div>
                <label for="carousel-background-color" class="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  id="carousel-background-color"
                  v-model="form.carousel_background_color"
                  type="color"
                  class="h-10 w-full rounded border border-gray-300"
                  :disabled="loading"
                />
              </div>
            </div>

            <div>
              <label for="carousel-background-image" class="block text-sm font-medium text-gray-700 mb-1">
                Background Image URL
              </label>
              <input
                id="carousel-background-image"
                v-model="form.carousel_background_image"
                type="url"
                class="input-field"
                :disabled="loading"
                placeholder="https://example.com/background.jpg"
              />
            </div>

            <div class="flex items-center gap-2">
              <input
                id="carousel-random-background"
                v-model="form.carousel_random_background_images"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <label for="carousel-random-background" class="text-sm text-gray-700">
                Use random background images
              </label>
            </div>

            <div>
              <label for="carousel-background-opacity" class="block text-sm font-medium text-gray-700 mb-1">
                Background Opacity: {{ form.carousel_background_opacity }}
              </label>
              <input
                id="carousel-background-opacity"
                v-model.number="form.carousel_background_opacity"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="w-full"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Font Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Font Settings</h3>

            <div>
              <label for="carousel-font" class="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                id="carousel-font"
                v-model="form.carousel_font"
                class="input-field"
                :disabled="loading"
              >
                <option value="">Default Font</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Poppins-Bold.ttf">Poppins Bold</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>

            <div>
              <label for="carousel-font-size" class="block text-sm font-medium text-gray-700 mb-1">
                Font Size: {{ form.carousel_font_size }}px
              </label>
              <input
                id="carousel-font-size"
                v-model.number="form.carousel_font_size"
                type="range"
                min="8"
                max="72"
                step="1"
                class="w-full"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Border Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Border</h3>

            <div class="flex items-center gap-2">
              <input
                id="carousel-border"
                v-model="form.carousel_border"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <label for="carousel-border" class="text-sm text-gray-700">
                Enable border
              </label>
            </div>

            <div v-if="form.carousel_border" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="carousel-border-color" class="block text-sm font-medium text-gray-700 mb-1">
                  Border Color
                </label>
                <input
                  id="carousel-border-color"
                  v-model="form.carousel_border_color"
                  type="color"
                  class="h-10 w-full rounded border border-gray-300"
                  :disabled="loading"
                />
              </div>

              <div>
                <label for="carousel-border-width" class="block text-sm font-medium text-gray-700 mb-1">
                  Border Width: {{ form.carousel_border_width }}px
                </label>
                <input
                  id="carousel-border-width"
                  v-model.number="form.carousel_border_width"
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  class="w-full"
                  :disabled="loading"
                />
              </div>
            </div>
          </div>

          <!-- Logo Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Logo</h3>

            <div>
              <label for="logo-position" class="block text-sm font-medium text-gray-700 mb-1">
                Logo Position
              </label>
              <select
                id="logo-position"
                v-model="form.logo_position"
                class="input-field"
                :disabled="loading"
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>

            <div>
              <label for="carousel-logo-opacity" class="block text-sm font-medium text-gray-700 mb-1">
                Logo Opacity: {{ form.carousel_logo_opacity }}
              </label>
              <input
                id="carousel-logo-opacity"
                v-model.number="form.carousel_logo_opacity"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="w-full"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Arrow Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Arrow</h3>

            <div class="flex items-center gap-2">
              <input
                id="carousel-arrow"
                v-model="form.carousel_arrow"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <label for="carousel-arrow" class="text-sm text-gray-700">
                Show arrow
              </label>
            </div>

            <div v-if="form.carousel_arrow" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="carousel-arrow-color" class="block text-sm font-medium text-gray-700 mb-1">
                  Arrow Color
                </label>
                <input
                  id="carousel-arrow-color"
                  v-model="form.carousel_arrow_color"
                  type="color"
                  class="h-10 w-full rounded border border-gray-300"
                  :disabled="loading"
                />
              </div>

              <div>
                <label for="carousel-arrow-opacity" class="block text-sm font-medium text-gray-700 mb-1">
                  Arrow Opacity: {{ form.carousel_arrow_opacity }}
                </label>
                <input
                  id="carousel-arrow-opacity"
                  v-model.number="form.carousel_arrow_opacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  class="w-full"
                  :disabled="loading"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Shortvideo Category -->
        <div v-if="activeCategory === 'shortvideo'" class="space-y-6">
          <!-- Subtitles Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Subtitles</h3>

            <div class="flex items-center gap-2">
              <input
                id="shortvideo-enable-subtitles"
                v-model="form.shortvideo_enable_subtitles"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <label for="shortvideo-enable-subtitles" class="text-sm text-gray-700">
                Enable subtitles
              </label>
            </div>

            <div class="flex items-center gap-2">
              <input
                id="shortvideo-subtitle-boxes"
                v-model="form.shortvideo_subtitle_boxes"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <label for="shortvideo-subtitle-boxes" class="text-sm text-gray-700">
                Show subtitle boxes
              </label>
            </div>

            <div>
              <label for="shortvideo-subtitle-style" class="block text-sm font-medium text-gray-700 mb-1">
                Subtitle Style
              </label>
              <select
                id="shortvideo-subtitle-style"
                v-model="form.shortvideo_subtitle_style"
                class="input-field"
                :disabled="loading"
              >
                <option value="karaoke">Karaoke</option>
                <option value="static">Static</option>
                <option value="fade">Fade</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <input
                id="shortvideo-uppercase"
                v-model="form.shortvideo_uppercase"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <label for="shortvideo-uppercase" class="text-sm text-gray-700">
                Uppercase text
              </label>
            </div>
          </div>

          <!-- Font Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Font</h3>

            <div>
              <label for="shortvideo-font" class="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                id="shortvideo-font"
                v-model="form.shortvideo_font"
                class="input-field"
                :disabled="loading"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Impact">Impact</option>
              </select>
            </div>

            <div>
              <label for="shortvideo-font-size" class="block text-sm font-medium text-gray-700 mb-1">
                Font Size: {{ form.shortvideo_font_size }}px
              </label>
              <input
                id="shortvideo-font-size"
                v-model.number="form.shortvideo_font_size"
                type="range"
                min="24"
                max="96"
                step="4"
                class="w-full"
                :disabled="loading"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="shortvideo-text-color" class="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <input
                  id="shortvideo-text-color"
                  v-model="form.shortvideo_text_color"
                  type="color"
                  class="h-10 w-full rounded border border-gray-300"
                  :disabled="loading"
                />
              </div>

              <div>
                <label for="shortvideo-highlight-color" class="block text-sm font-medium text-gray-700 mb-1">
                  Highlight Color
                </label>
                <input
                  id="shortvideo-highlight-color"
                  v-model="form.shortvideo_highlight_color"
                  type="color"
                  class="h-10 w-full rounded border border-gray-300"
                  :disabled="loading"
                />
              </div>
            </div>
          </div>

          <!-- Audio Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Audio</h3>

            <div>
              <label for="shortvideo-voice-name" class="block text-sm font-medium text-gray-700 mb-1">
                Voice
              </label>
              <select
                id="shortvideo-voice-name"
                v-model="form.shortvideo_voice_name"
                class="input-field"
                :disabled="loading"
              >
                <option value="Achird">Achird (Male)</option>
                <option value="Alkes">Alkes (Female)</option>
                <option value="Antares">Antares (Male)</option>
                <option value="Bellatrix">Bellatrix (Female)</option>
              </select>
            </div>

            <div>
              <label for="shortvideo-voice-volume" class="block text-sm font-medium text-gray-700 mb-1">
                Voice Volume: {{ form.shortvideo_voice_volume }}
              </label>
              <input
                id="shortvideo-voice-volume"
                v-model.number="form.shortvideo_voice_volume"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="w-full"
                :disabled="loading"
              />
            </div>

            <div>
              <label for="shortvideo-speaking-rate" class="block text-sm font-medium text-gray-700 mb-1">
                Speaking Rate: {{ form.shortvideo_speaking_rate }}
              </label>
              <input
                id="shortvideo-speaking-rate"
                v-model.number="form.shortvideo_speaking_rate"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                class="w-full"
                :disabled="loading"
              />
            </div>

            <div>
              <label for="shortvideo-music" class="block text-sm font-medium text-gray-700 mb-1">
                Background Music
              </label>
              <select
                id="shortvideo-music"
                v-model="form.shortvideo_music"
                class="input-field"
                :disabled="loading"
              >
                <option value="">None</option>
                <option value="upbeat">Upbeat</option>
                <option value="calm">Calm</option>
                <option value="energetic">Energetic</option>
              </select>
            </div>

            <div>
              <label for="shortvideo-music-volume" class="block text-sm font-medium text-gray-700 mb-1">
                Music Volume: {{ form.shortvideo_music_volume }}
              </label>
              <input
                id="shortvideo-music-volume"
                v-model.number="form.shortvideo_music_volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                class="w-full"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Intro/Outro Section -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-gray-900">Intro & Outro</h3>

            <div class="flex items-center gap-2">
              <input
                id="shortvideo-show-intro"
                v-model="form.shortvideo_show_intro"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <label for="shortvideo-show-intro" class="text-sm text-gray-700">
                Show intro
              </label>
            </div>

            <div class="flex items-center gap-2">
              <input
                id="shortvideo-show-outro"
                v-model="form.shortvideo_show_outro"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="loading"
              />
              <label for="shortvideo-show-outro" class="text-sm text-gray-700">
                Show outro
              </label>
            </div>

            <div v-if="form.shortvideo_show_outro">
              <label for="shortvideo-outro-text" class="block text-sm font-medium text-gray-700 mb-1">
                Outro Text
              </label>
              <input
                id="shortvideo-outro-text"
                v-model="form.shortvideo_outro_text"
                type="text"
                class="input-field"
                :disabled="loading"
                placeholder="Thanks for watching!"
              />
            </div>

            <div v-if="form.shortvideo_show_outro">
              <label for="shortvideo-outro-background" class="block text-sm font-medium text-gray-700 mb-1">
                Outro Background Color
              </label>
              <input
                id="shortvideo-outro-background"
                v-model="form.shortvideo_outro_background_color"
                type="color"
                class="h-10 w-full rounded border border-gray-300"
                :disabled="loading"
              />
            </div>
          </div>
        </div>

        <!-- Account Info (always at bottom) -->
        <div v-if="activeCategory === 'account'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input type="text" :value="userId" class="input-field bg-gray-50" disabled readonly />
          </div>

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
        <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
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
  (e: 'submit', data: {
    // Direct DB fields
    company_name?: string
    company_website?: string
    logo_url?: string
    target_audience?: string
    output_language?: string
    // JSON settings
    settings?: Record<string, any>
  }): void
}

const props = withDefaults(defineProps<Props>(), {
  superuser: false,
  loading: false,
  error: null,
  success: false,
})

const emit = defineEmits<Emits>()

const activeCategory = ref('company')

const categories = [
  { id: 'company', label: 'Company' },
  { id: 'target_audience', label: 'Target Audience' },
  { id: 'text', label: 'Text' },
  { id: 'branding', label: 'Branding' },
  { id: 'image', label: 'Image' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'shortvideo', label: 'Shortvideo' },
  { id: 'account', label: 'Account' },
]

// Form with all fields
const form = ref({
  // Direct DB fields
  company_name: '',
  company_website: '',
  logo_url: '',
  target_audience: '',
  output_language: 'en',

  // Settings (JSON) fields
  company_tagline: '',
  signature: '',
  brand_primary_color: '#2c5a61',
  brand_secondary_color: '#ffffff',
  brand_tertiary_color: '#15191a',
  imagegen_style: '',

  // Carousel settings
  carousel_text_color: '#ffffff',
  carousel_font: '',
  carousel_font_size: 11,
  carousel_background_color: '#ffffff',
  carousel_background_image: '',
  carousel_random_background_images: false,
  carousel_background_opacity: 0.8,
  carousel_border: false,
  carousel_border_color: '#cccccc',
  carousel_border_width: 10,
  carousel_logo_opacity: 1,
  logo_position: 'top-right',
  carousel_arrow: false,
  carousel_arrow_color: '#2d2d2d',
  carousel_arrow_opacity: 0.6,

  // Shortvideo settings
  shortvideo_enable_subtitles: true,
  shortvideo_subtitle_boxes: true,
  shortvideo_voice_name: 'Achird',
  shortvideo_voice_volume: 1.0,
  shortvideo_speaking_rate: 1.0,
  shortvideo_music: '',
  shortvideo_music_volume: 0.10,
  shortvideo_show_intro: false,
  shortvideo_show_outro: false,
  shortvideo_outro_text: '',
  shortvideo_outro_background_color: 'black',
  shortvideo_subtitle_style: 'karaoke',
  shortvideo_font: 'Arial',
  shortvideo_font_size: 48,
  shortvideo_text_color: 'white',
  shortvideo_highlight_color: 'red',
  shortvideo_uppercase: false,
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
      // Load direct DB fields
      form.value.company_name = newProfile.company_name || ''
      form.value.company_website = newProfile.company_website || ''
      form.value.logo_url = newProfile.logo_url || ''
      form.value.target_audience = newProfile.target_audience || ''
      form.value.output_language = newProfile.output_language || 'en'

      // Load settings (JSON) fields
      if (newProfile.settings) {
        const settings = newProfile.settings as Record<string, any>

        form.value.company_tagline = settings.company_tagline || ''
        form.value.signature = settings.signature || ''
        form.value.brand_primary_color = settings.brand_primary_color || '#2c5a61'
        form.value.brand_secondary_color = settings.brand_secondary_color || '#ffffff'
        form.value.brand_tertiary_color = settings.brand_tertiary_color || '#15191a'
        form.value.imagegen_style = settings.imagegen_style || ''

        // Carousel
        form.value.carousel_text_color = settings.brand_text_color || settings.carousel_text_color || '#ffffff'
        form.value.carousel_font = settings.brand_font || settings.carousel_font || ''
        form.value.carousel_font_size = settings.brand_font_size || settings.carousel_font_size || 11
        form.value.carousel_background_color = settings.brand_background_color || settings.carousel_background_color || '#ffffff'
        form.value.carousel_background_image = settings.brand_background_image || settings.carousel_background_image || ''
        form.value.carousel_random_background_images = settings.brand_random_background_images || settings.carousel_random_background_images || false
        form.value.carousel_background_opacity = settings.brand_background_opacity || settings.carousel_background_opacity || 0.8
        form.value.carousel_border = settings.brand_border || settings.carousel_border || false
        form.value.carousel_border_color = settings.brand_border_color || settings.carousel_border_color || '#cccccc'
        form.value.carousel_border_width = settings.brand_border_width || settings.carousel_border_width || 10
        form.value.carousel_logo_opacity = settings.brand_logo_opacity || settings.carousel_logo_opacity || 1
        form.value.logo_position = settings.logo_position || 'top-right'
        form.value.carousel_arrow = settings.brand_arrow || settings.carousel_arrow || false
        form.value.carousel_arrow_color = settings.brand_arrow_color || settings.carousel_arrow_color || '#2d2d2d'
        form.value.carousel_arrow_opacity = settings.brand_arrow_opacity || settings.carousel_arrow_opacity || 0.6

        // Shortvideo
        form.value.shortvideo_enable_subtitles = settings.shortvideo_enable_subtitles ?? true
        form.value.shortvideo_subtitle_boxes = settings.shortvideo_subtitle_boxes ?? true
        form.value.shortvideo_voice_name = settings.shortvideo_voice_name || 'Achird'
        form.value.shortvideo_voice_volume = settings.shortvideo_voice_volume ?? 1.0
        form.value.shortvideo_speaking_rate = settings.shortvideo_speaking_rate ?? 1.0
        form.value.shortvideo_music = settings.shortvideo_music || ''
        form.value.shortvideo_music_volume = settings.shortvideo_music_volume ?? 0.10
        form.value.shortvideo_show_intro = settings.shortvideo_show_intro || false
        form.value.shortvideo_show_outro = settings.shortvideo_show_outro || false
        form.value.shortvideo_outro_text = settings.shortvideo_outro_text || ''
        form.value.shortvideo_outro_background_color = settings.shortvideo_outro_background_color || 'black'
        form.value.shortvideo_subtitle_style = settings.shortvideo_subtitle_style || 'karaoke'
        form.value.shortvideo_font = settings.shortvideo_font || 'Arial'
        form.value.shortvideo_font_size = settings.shortvideo_font_size ?? 48
        form.value.shortvideo_text_color = settings.shortvideo_text_color || 'white'
        form.value.shortvideo_highlight_color = settings.shortvideo_highlight_color || 'red'
        form.value.shortvideo_uppercase = settings.shortvideo_uppercase || false
      }

      initialForm.value = { ...form.value }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  // Direct DB fields
  const dbUpdates: Record<string, string | undefined> = {}

  if (form.value.company_name.trim()) {
    dbUpdates.company_name = form.value.company_name.trim()
  }

  if (form.value.company_website.trim()) {
    dbUpdates.company_website = form.value.company_website.trim()
  }

  if (form.value.logo_url.trim()) {
    dbUpdates.logo_url = form.value.logo_url.trim()
  }

  if (form.value.target_audience.trim()) {
    dbUpdates.target_audience = form.value.target_audience.trim()
  }

  if (form.value.output_language) {
    dbUpdates.output_language = form.value.output_language
  }

  // JSON settings field
  const settings: Record<string, any> = {
    company_tagline: form.value.company_tagline,
    signature: form.value.signature,
    brand_primary_color: form.value.brand_primary_color,
    brand_secondary_color: form.value.brand_secondary_color,
    brand_tertiary_color: form.value.brand_tertiary_color,
    imagegen_style: form.value.imagegen_style,

    // Carousel (using new naming but keeping old for compatibility)
    brand_text_color: form.value.carousel_text_color,
    carousel_text_color: form.value.carousel_text_color,
    brand_font: form.value.carousel_font,
    carousel_font: form.value.carousel_font,
    brand_font_size: form.value.carousel_font_size,
    carousel_font_size: form.value.carousel_font_size,
    brand_background_color: form.value.carousel_background_color,
    carousel_background_color: form.value.carousel_background_color,
    brand_background_image: form.value.carousel_background_image,
    carousel_background_image: form.value.carousel_background_image,
    brand_random_background_images: form.value.carousel_random_background_images,
    carousel_random_background_images: form.value.carousel_random_background_images,
    brand_background_opacity: form.value.carousel_background_opacity,
    carousel_background_opacity: form.value.carousel_background_opacity,
    brand_border: form.value.carousel_border,
    carousel_border: form.value.carousel_border,
    brand_border_color: form.value.carousel_border_color,
    carousel_border_color: form.value.carousel_border_color,
    brand_border_width: form.value.carousel_border_width,
    carousel_border_width: form.value.carousel_border_width,
    brand_logo_opacity: form.value.carousel_logo_opacity,
    carousel_logo_opacity: form.value.carousel_logo_opacity,
    logo_position: form.value.logo_position,
    brand_arrow: form.value.carousel_arrow,
    carousel_arrow: form.value.carousel_arrow,
    brand_arrow_color: form.value.carousel_arrow_color,
    carousel_arrow_color: form.value.carousel_arrow_color,
    brand_arrow_opacity: form.value.carousel_arrow_opacity,
    carousel_arrow_opacity: form.value.carousel_arrow_opacity,

    // Shortvideo
    shortvideo_enable_subtitles: form.value.shortvideo_enable_subtitles,
    shortvideo_subtitle_boxes: form.value.shortvideo_subtitle_boxes,
    shortvideo_voice_name: form.value.shortvideo_voice_name,
    shortvideo_voice_volume: form.value.shortvideo_voice_volume,
    shortvideo_speaking_rate: form.value.shortvideo_speaking_rate,
    shortvideo_music: form.value.shortvideo_music,
    shortvideo_music_volume: form.value.shortvideo_music_volume,
    shortvideo_show_intro: form.value.shortvideo_show_intro,
    shortvideo_show_outro: form.value.shortvideo_show_outro,
    shortvideo_outro_text: form.value.shortvideo_outro_text,
    shortvideo_outro_background_color: form.value.shortvideo_outro_background_color,
    shortvideo_subtitle_style: form.value.shortvideo_subtitle_style,
    shortvideo_font: form.value.shortvideo_font,
    shortvideo_font_size: form.value.shortvideo_font_size,
    shortvideo_text_color: form.value.shortvideo_text_color,
    shortvideo_highlight_color: form.value.shortvideo_highlight_color,
    shortvideo_uppercase: form.value.shortvideo_uppercase,
  }

  emit('submit', {
    ...dbUpdates,
    settings
  })

  initialForm.value = { ...form.value }
}

function handleReset() {
  form.value = { ...initialForm.value }
}
</script>
