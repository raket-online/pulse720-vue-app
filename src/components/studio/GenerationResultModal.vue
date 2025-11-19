<template>
  <Modal
    :model-value="show"
    :title="`Generated ${contentTypeLabel}`"
    size="large"
    @close="handleClose"
  >
    <div v-if="result" class="space-y-6">
      <!-- Post Result -->
      <div v-if="type === 'post'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input v-model="editableResult.title" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hook</label>
          <input v-model="editableResult.hook" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            v-model="editableResult.content"
            rows="12"
            class="input-field resize-none font-mono text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
          <input v-model="editableResult.keywords" type="text" class="input-field" />
        </div>

        <div v-if="editableResult.imageUrl">
          <label class="block text-sm font-medium text-gray-700 mb-2">Generated Image</label>
          <img
            :src="editableResult.imageUrl"
            alt="Generated image"
            class="w-full max-w-md rounded-lg border border-gray-200"
          />
        </div>
      </div>

      <!-- Blog Result -->
      <div v-else-if="type === 'blog'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input v-model="editableResult.title" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <div
            class="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto prose prose-sm"
            v-html="editableResult.content"
          />
        </div>

        <div v-if="editableResult.framework">
          <label class="block text-sm font-medium text-gray-700 mb-2">Framework Used</label>
          <p class="text-sm text-gray-600">
            {{ editableResult.framework }}
          </p>
        </div>

        <div v-if="editableResult.imageUrl">
          <label class="block text-sm font-medium text-gray-700 mb-2">Header Image</label>
          <img
            :src="editableResult.imageUrl"
            alt="Blog header"
            class="w-full rounded-lg border border-gray-200"
          />
        </div>
      </div>

      <!-- Carousel Result -->
      <div v-else-if="type === 'carousel'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hook</label>
          <input v-model="editableResult.hook" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Caption</label>
          <textarea v-model="editableResult.body" rows="6" class="input-field resize-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Slides ({{ editableResult.slides?.length || 0 }})
          </label>
          <div class="space-y-3">
            <div
              v-for="slide in editableResult.slides"
              :key="slide.sheet"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="text-xs font-medium text-gray-500 mb-1">Slide {{ slide.sheet }}</div>
              <p class="text-sm whitespace-pre-wrap">
                {{ slide.text }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="editableResult.pdfUrl">
          <label class="block text-sm font-medium text-gray-700 mb-2">Generated PDF</label>
          <a
            :href="editableResult.pdfUrl"
            target="_blank"
            class="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Carousel PDF
          </a>
        </div>
      </div>

      <!-- Video Result -->
      <div v-else-if="type === 'shortvideo'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input v-model="editableResult.title" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Caption</label>
          <textarea v-model="editableResult.body" rows="6" class="input-field resize-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Scenes ({{ editableResult.sentences?.length || 0 }})
          </label>
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div
              v-for="sentence in editableResult.sentences"
              :key="sentence.sheet"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="text-xs font-medium text-gray-500 mb-1">Scene {{ sentence.sheet }}</div>
              <p class="text-sm mb-2">
                {{ sentence.text }}
              </p>
              <p class="text-xs text-gray-500 italic">
                {{ sentence.visual_cue }}
              </p>
              <img
                v-if="sentence.image_url"
                :src="sentence.image_url"
                alt="Scene image"
                class="mt-2 w-32 h-auto rounded border border-gray-200"
              />
            </div>
          </div>
        </div>

        <div v-if="editableResult.videoUrl">
          <label class="block text-sm font-medium text-gray-700 mb-2">Generated Video</label>
          <video :src="editableResult.videoUrl" controls class="w-full rounded-lg" />
        </div>

        <div v-if="editableResult.callToAction">
          <label class="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
          <p class="text-sm text-gray-600">
            {{ editableResult.callToAction }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">No content generated yet</div>

    <template #footer>
      <button class="btn-secondary" @click="handleClose">Close</button>
      <button class="btn-secondary" @click="handleCopy">Copy Content</button>
      <button class="btn-primary" :disabled="saving" @click="handleSave">
        <span v-if="!saving">Save to Content</span>
        <span v-else>Saving...</span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import { useContentStore } from '@/stores/content'
import { useAuthStore } from '@/stores/auth'
import * as contentService from '@/services/content'

interface Props {
  show: boolean
  result: any
  type: 'post' | 'blog' | 'carousel' | 'shortvideo' | null
  pillarId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', content: any): void
}>()

const contentStore = useContentStore()
const authStore = useAuthStore()

const editableResult = ref<any>({})
const saving = ref(false)

const contentTypeLabel = computed(() => {
  const labels: Record<string, string> = {
    post: 'Social Post',
    blog: 'Blog Article',
    carousel: 'Carousel',
    shortvideo: 'Short Video',
  }
  return props.type ? labels[props.type] : 'Content'
})

watch(
  () => props.result,
  (newResult) => {
    if (newResult) {
      editableResult.value = JSON.parse(JSON.stringify(newResult))
    }
  },
  { immediate: true }
)

function handleClose() {
  emit('close')
}

function handleCopy() {
  let textToCopy = ''

  if (props.type === 'post') {
    textToCopy = `${editableResult.value.title}\n\n${editableResult.value.hook}\n\n${editableResult.value.content}`
  } else if (props.type === 'blog') {
    textToCopy = `${editableResult.value.title}\n\n${editableResult.value.content}`
  } else if (props.type === 'carousel') {
    textToCopy = `${editableResult.value.body}\n\nSlides:\n${editableResult.value.slides?.map((s: any) => `${s.sheet}. ${s.text}`).join('\n\n')}`
  } else if (props.type === 'shortvideo') {
    textToCopy = `${editableResult.value.title}\n\n${editableResult.value.body}`
  }

  navigator.clipboard.writeText(textToCopy)
}

async function handleSave() {
  if (!props.type || !props.pillarId || !authStore.userId) {
    return
  }

  try {
    saving.value = true

    const contentData: any = {
      pillar_id: props.pillarId,
      user_id: authStore.userId,
      type: props.type,
      title: editableResult.value.title || '',
      content: '',
      hook: null,
      media_url: null,
      keywords: null,
      visual_description: null,
      json_content: null,
    }

    if (props.type === 'post') {
      contentData.title = editableResult.value.title
      contentData.hook = editableResult.value.hook
      contentData.content = editableResult.value.content
      contentData.keywords = editableResult.value.keywords
      contentData.visual_description = editableResult.value.visualDescription
      contentData.media_url = editableResult.value.imageUrl
    } else if (props.type === 'blog') {
      contentData.title = editableResult.value.title
      contentData.content = editableResult.value.content
      contentData.media_url = editableResult.value.imageUrl
      contentData.json_content = {
        framework: editableResult.value.framework,
        summary: editableResult.value.summary,
      }
    } else if (props.type === 'carousel') {
      contentData.title = editableResult.value.hook
      contentData.content = editableResult.value.body
      contentData.media_url = editableResult.value.pdfUrl
      contentData.json_content = {
        slides: editableResult.value.slides,
      }
    } else if (props.type === 'shortvideo') {
      contentData.title = editableResult.value.title
      contentData.content = editableResult.value.body
      contentData.media_url = editableResult.value.videoUrl
      contentData.json_content = {
        sentences: editableResult.value.sentences,
        callToAction: editableResult.value.callToAction,
      }
    }

    const result = await contentService.createContent(contentData)

    if (result.success && result.data) {
      contentStore.addContent(result.data)
      emit('saved', result.data)
      emit('close')
    } else {
      throw new Error(result.error || 'Failed to save content')
    }
  } catch (error) {
    console.error('Save error:', error)
    alert('Failed to save content. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>
