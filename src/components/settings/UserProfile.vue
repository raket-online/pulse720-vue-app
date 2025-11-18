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
          <!-- Logo Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>

            <div class="flex items-start gap-4">
              <!-- Current Logo Preview -->
              <div v-if="form.logo_url" class="flex-shrink-0">
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <img
                    :src="form.logo_url"
                    alt="Company logo"
                    class="h-24 w-auto max-w-xs object-contain"
                    @error="handleLogoError"
                  />
                </div>
                <button
                  type="button"
                  @click="handleRemoveLogo"
                  class="text-sm text-red-600 hover:text-red-700 mt-2"
                  :disabled="loading || uploadingLogo"
                >
                  Remove logo
                </button>
              </div>

              <!-- File Upload Area -->
              <div class="flex-1">
                <div
                  @click="triggerLogoInput"
                  @dragover.prevent="isLogoDragging = true"
                  @dragleave.prevent="isLogoDragging = false"
                  @drop.prevent="handleLogoDrop"
                  :class="[
                    'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                    isLogoDragging
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-400',
                    (loading || uploadingLogo) && 'opacity-50 cursor-not-allowed',
                  ]"
                >
                  <input
                    ref="logoInput"
                    type="file"
                    accept="image/png"
                    @change="handleLogoSelect"
                    class="hidden"
                    :disabled="loading || uploadingLogo"
                  />

                  <div v-if="!selectedLogo">
                    <svg
                      class="w-10 h-10 mx-auto text-gray-400 mb-2"
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
                    <p class="text-xs text-gray-500">PNG only (max 1MB)</p>
                  </div>

                  <div v-else class="flex items-center justify-center gap-3">
                    <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div class="text-left">
                      <p class="text-sm font-medium text-gray-900">{{ selectedLogo.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(selectedLogo.size) }}</p>
                    </div>
                    <button
                      type="button"
                      @click.stop="clearLogo"
                      class="p-1 hover:bg-gray-100 rounded"
                      :disabled="loading || uploadingLogo"
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

                <!-- Upload Progress -->
                <div v-if="uploadingLogo" class="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    <span class="text-sm text-primary-700">Uploading logo...</span>
                  </div>
                </div>

                <!-- Upload Error -->
                <div v-if="logoUploadError" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {{ logoUploadError }}
                </div>

                <!-- Manual URL Input (Advanced) -->
                <details class="mt-3">
                  <summary class="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    Or enter logo URL manually
                  </summary>
                  <div class="mt-2">
                    <input
                      id="logo-url"
                      v-model="form.logo_url"
                      type="url"
                      class="input-field text-sm"
                      :disabled="loading || uploadingLogo"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </details>
              </div>
            </div>
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

        <!-- LinkedIn Category -->
        <div v-if="activeCategory === 'linkedin'" class="space-y-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-[#0A66C2] rounded flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">LinkedIn Connection</h3>
              <p class="text-sm text-gray-600">
                {{
                  linkedInProfile
                    ? 'Connected'
                    : 'Connect your LinkedIn account to post content directly'
                }}
              </p>
            </div>
            <div v-if="linkedInProfile" class="ml-auto">
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
                @click="handleLinkedInConnect"
                type="button"
                class="btn-primary text-sm"
                :disabled="linkedInLoading"
              >
                <span v-if="linkedInLoading">Reconnecting...</span>
                <span v-else>Reconnect LinkedIn</span>
              </button>
              <button
                @click="handleLinkedInDisconnect"
                type="button"
                class="btn-secondary text-sm"
                :disabled="linkedInLoading"
              >
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

            <button
              @click="handleLinkedInConnect"
              type="button"
              class="btn-primary"
              :disabled="linkedInLoading"
            >
              <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
              <span v-if="linkedInLoading">Connecting...</span>
              <span v-else>Connect LinkedIn Account</span>
            </button>
          </div>

          <!-- LinkedIn Error Message -->
          <div
            v-if="linkedInError"
            class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {{ linkedInError }}
          </div>

          <!-- LinkedIn Success Message -->
          <div
            v-if="linkedInSuccess"
            class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
          >
            {{ linkedInSuccess }}
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
import type { LinkedInProfile } from '@/services/linkedin'
import * as storageService from '@/services/storage'

interface Props {
  userId: string
  profile: UserProfile | null
  superuser?: boolean
  loading?: boolean
  error?: string | null
  success?: boolean
  // LinkedIn props
  linkedInProfile?: LinkedInProfile | null
  linkedInLoading?: boolean
  linkedInError?: string | null
  linkedInSuccess?: string | null
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
  (e: 'linkedinConnect'): void
  (e: 'linkedinDisconnect'): void
}

const props = withDefaults(defineProps<Props>(), {
  superuser: false,
  loading: false,
  error: null,
  success: false,
  linkedInProfile: null,
  linkedInLoading: false,
  linkedInError: null,
  linkedInSuccess: null,
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
  { id: 'linkedin', label: 'LinkedIn' },
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

// Logo upload refs and state
const logoInput = ref<HTMLInputElement | null>(null)
const selectedLogo = ref<File | null>(null)
const isLogoDragging = ref(false)
const uploadingLogo = ref(false)
const logoUploadError = ref<string | null>(null)

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

// Logo upload functions
function triggerLogoInput() {
  if (!uploadingLogo.value && !props.loading) {
    logoInput.value?.click()
  }
}

function handleLogoSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndSetLogo(file)
  }
}

function handleLogoDrop(event: DragEvent) {
  isLogoDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    validateAndSetLogo(file)
  }
}

function validateAndSetLogo(file: File) {
  logoUploadError.value = null

  // Validate file type (PNG only)
  if (file.type !== 'image/png') {
    logoUploadError.value = 'Please select a PNG image file'
    return
  }

  // Validate file size (max 1MB)
  const maxSize = 1 * 1024 * 1024 // 1MB
  if (file.size > maxSize) {
    logoUploadError.value = 'File size must be less than 1MB'
    return
  }

  selectedLogo.value = file
  // Auto-upload the logo
  uploadLogo()
}

async function uploadLogo() {
  if (!selectedLogo.value || !form.value.company_name) {
    logoUploadError.value = 'Please enter a company name before uploading a logo'
    return
  }

  uploadingLogo.value = true
  logoUploadError.value = null

  try {
    // Generate filename
    const filename = storageService.generateLogoFilename(
      form.value.company_name,
      selectedLogo.value.name
    )

    // Upload to storage
    const result = await storageService.uploadFile(
      'pulse720_user_storage',
      `logos/${filename}`,
      selectedLogo.value
    )

    if (result.success && result.data) {
      // Update logo URL in form
      form.value.logo_url = result.data
      selectedLogo.value = null
    } else {
      logoUploadError.value = result.error || 'Failed to upload logo'
    }
  } catch (err) {
    logoUploadError.value = err instanceof Error ? err.message : 'An error occurred during upload'
  } finally {
    uploadingLogo.value = false
  }
}

function clearLogo() {
  selectedLogo.value = null
  logoUploadError.value = null
  if (logoInput.value) {
    logoInput.value.value = ''
  }
}

function handleRemoveLogo() {
  if (confirm('Are you sure you want to remove the logo?')) {
    form.value.logo_url = ''
    selectedLogo.value = null
  }
}

function handleLogoError() {
  // Handle broken image URL
  console.error('Failed to load logo image')
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// LinkedIn computed properties and functions
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

function handleLinkedInConnect() {
  emit('linkedinConnect')
}

function handleLinkedInDisconnect() {
  if (confirm('Are you sure you want to disconnect your LinkedIn account?')) {
    emit('linkedinDisconnect')
  }
}
</script>
