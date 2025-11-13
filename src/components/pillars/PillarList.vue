<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-lg font-medium">Failed to load pillars</p>
        <p class="text-sm text-gray-600 mt-1">{{ error }}</p>
      </div>
      <button @click="$emit('retry')" class="btn-primary">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="pillars.length === 0" class="text-center py-12">
      <div class="mb-6">
        <svg
          class="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Content Pillars Yet</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Content pillars are the foundation of your marketing strategy. Create your first pillar to
        organize your resources and content.
      </p>
      <button @click="$emit('create')" class="btn-primary">
        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Your First Pillar
      </button>
    </div>

    <!-- Pillar Grid -->
    <div v-else>
      <!-- Header with count and create button -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Your Content Pillars</h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ pillars.length }} pillar{{ pillars.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <button @click="$emit('create')" class="btn-primary">
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Pillar
        </button>
      </div>

      <!-- Grid of pillar cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PillarCard
          v-for="pillar in pillars"
          :key="pillar.id"
          :pillar="pillar"
          :is-selected="selectedPillarId === pillar.id"
          @select="$emit('select', pillar)"
          @edit="$emit('edit', pillar)"
          @delete="$emit('delete', pillar)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PillarCard from './PillarCard.vue'
import type { Pillar } from '@/lib/supabase'

interface Props {
  pillars: Pillar[]
  loading?: boolean
  error?: string | null
  selectedPillarId?: string | null
}

interface Emits {
  (e: 'create'): void
  (e: 'select', pillar: Pillar): void
  (e: 'edit', pillar: Pillar): void
  (e: 'delete', pillar: Pillar): void
  (e: 'retry'): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  selectedPillarId: null
})

defineEmits<Emits>()
</script>
