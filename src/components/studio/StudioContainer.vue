<template>
  <div>
    <Studio @generated="handleGenerated" />

    <GenerationResultModal
      :show="showResultModal"
      :result="generationResult"
      :type="contentStore.generationType"
      :pillar-id="selectedPillarId"
      @close="handleCloseModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useContentStore } from '@/stores/content'
import Studio from './Studio.vue'
import GenerationResultModal from './GenerationResultModal.vue'

const contentStore = useContentStore()

const showResultModal = ref(false)
const generationResult = ref<any>(null)
const selectedPillarId = ref<string>('')

function handleGenerated(result: any, pillarId: string) {
  generationResult.value = result
  selectedPillarId.value = pillarId
  showResultModal.value = true
}

function handleCloseModal() {
  showResultModal.value = false
  contentStore.clearGeneration()
}

function handleSaved() {
  showResultModal.value = false
  contentStore.clearGeneration()
}
</script>
