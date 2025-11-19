/**
 * Content Generator Orchestrator
 * Coordinates the full content generation workflow
 *
 * Note: Generation settings are centralized in src/config/generationConfig.ts
 * This orchestrator focuses on the multi-step workflow logic
 */

import { fillTemplate, IMAGE_PRESETS, type PromptPlaceholders } from './prompts'
import { getGenerationConfig, getAPIConfig } from '@/config/generationConfig'
import {
  generateText,
  generateImage,
  generateImageQuick,
  generateCarousel,
  generateVideo,
  type PostGenerationResult,
  type BlogGenerationResult,
  type CarouselGenerationResult,
  type VideoTranscriptResult,
  type GenerationServiceResult,
} from './generation'
import type { Resource } from '@/lib/supabase'

export interface GenerationOptions {
  contentType: 'post' | 'blog' | 'carousel' | 'shortvideo'
  pillarTitle: string
  resources: Resource[]
  targetMarket: string
  language: string
  style: string
  subject?: string
  // User profile settings
  brandPrimaryColor?: string
  brandSecondaryColor?: string
  signature?: string
  imageStyle?: string
  // Carousel settings
  carouselTheme?: string
  carouselSettings?: any
  // Video settings
  videoTheme?: string
  videoSettings?: any
}

export interface GenerationProgress {
  step: string
  progress: number
  message: string
}

export type ProgressCallback = (progress: GenerationProgress) => void

/**
 * Get all resource texts combined
 */
function combineResources(resources: Resource[]): string {
  return resources
    .map((r) => r.content)
    .filter(Boolean)
    .join('\n\n---RESOURCE---\n\n')
}

/**
 * Build prompt placeholders
 */
function buildPlaceholders(options: GenerationOptions, inputText: string): PromptPlaceholders {
  return {
    SUBJECT: options.subject || options.pillarTitle,
    TARGET_MARKET: options.targetMarket,
    LANGUAGE: options.language,
    STYLE: options.style,
    INPUT_TEXT: inputText,
  }
}

/**
 * Build image prompt with branding
 */
function buildImagePrompt(
  preset: string,
  subject: string,
  visualDescription: string,
  primaryColor?: string,
  secondaryColor?: string
): string {
  const presetConfig = IMAGE_PRESETS[preset]
  if (!presetConfig) {
    throw new Error(`Unknown image preset: ${preset}`)
  }

  const prompt = presetConfig.promptTemplate
    .replace(/#SUBJECT#/g, subject)
    .replace(/#VISUAL_DESCRIPTION#/g, visualDescription)
    .replace(/#PRIMARY_COLOR#/g, primaryColor || '#3B82F6')
    .replace(/#SECONDARY_COLOR#/g, secondaryColor || '#10B981')

  // Add image style if specified
  return prompt
}

// ==================== Social Post Generation ====================

export interface PostResult {
  title: string
  hook: string
  content: string
  keywords: string
  visualDescription: string
  imageUrl?: string
}

export async function generatePost(
  options: GenerationOptions,
  onProgress?: ProgressCallback
): Promise<GenerationServiceResult<PostResult>> {
  try {
    // Step 1: Combine resources
    onProgress?.({ step: 'resources', progress: 10, message: 'Collecting resources...' })
    const inputText = combineResources(options.resources)

    if (!inputText.trim()) {
      throw new Error('No resource content available')
    }

    // Step 2: Generate text content
    onProgress?.({ step: 'text', progress: 30, message: 'Generating post content...' })
    const placeholders = buildPlaceholders(options, inputText)

    // Get configuration from central config
    const config = getGenerationConfig('post')
    const prompt = fillTemplate(config.promptTemplate, placeholders)

    const textResult = await generateText({
      ...getAPIConfig('post'),
      prompt,
    })

    console.log('Post text generation result:', textResult)

    if (!textResult.success || !textResult.data) {
      console.error('Post text generation failed:', textResult)
      throw new Error(textResult.error || 'Failed to generate post text')
    }

    console.log('Post data structure:', textResult.data)
    const postData = textResult.data as PostGenerationResult
    console.log('Post data after cast:', postData)

    // Validate post data structure
    if (!postData.post) {
      console.error('Invalid post data structure. Expected {post: {...}}, got:', postData)
      throw new Error('Invalid API response structure for post generation')
    }

    if (!postData.post.title || !postData.post.content) {
      console.error('Missing required post fields:', postData.post)
      throw new Error('API response missing required post fields (title or content)')
    }

    // Add signature if available
    let content = postData.post.content
    if (options.signature) {
      content += `\n\n${options.signature}`
    }

    // Step 3: Generate image
    onProgress?.({ step: 'image', progress: 70, message: 'Generating post image...' })
    const imagePrompt = buildImagePrompt(
      'post',
      postData.post.title,
      postData.post.summary || postData.post.content.substring(0, 200),
      options.brandPrimaryColor,
      options.brandSecondaryColor
    )

    const imageResult = await generateImage({
      prompt: imagePrompt,
      model: 'ideogram/v3',
      endpoint: 'ideogram/v3',
      imageSize: 'square_hd',
      style: 'DESIGN',
      renderingSpeed: 'TURBO',
      expandPrompt: true,
    })

    onProgress?.({ step: 'complete', progress: 100, message: 'Post generation complete!' })

    return {
      success: true,
      data: {
        title: postData.post.title,
        hook: postData.post.hook || '',
        content,
        keywords: postData.post.keywords || '',
        visualDescription: postData.post.summary || postData.post.title,
        imageUrl: imageResult.data?.image_url,
      },
    }
  } catch (err) {
    console.error('Post generation error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate post',
    }
  }
}

// ==================== Blog Generation ====================

export interface BlogResult {
  title: string
  content: string
  framework: string
  summary: string
  imageUrl?: string
}

export async function generateBlog(
  options: GenerationOptions,
  onProgress?: ProgressCallback
): Promise<GenerationServiceResult<BlogResult>> {
  try {
    // Step 1: Combine resources
    onProgress?.({ step: 'resources', progress: 10, message: 'Collecting resources...' })
    const inputText = combineResources(options.resources)

    if (!inputText.trim()) {
      throw new Error('No resource content available')
    }

    // Step 2: Generate text content
    onProgress?.({ step: 'text', progress: 30, message: 'Generating blog content...' })
    const placeholders = buildPlaceholders(options, inputText)

    // Get configuration from central config
    const config = getGenerationConfig('blog')
    const prompt = fillTemplate(config.promptTemplate, placeholders)

    const textResult = await generateText({
      ...getAPIConfig('blog'),
      prompt,
    })

    console.log('Blog text generation result:', textResult)

    if (!textResult.success || !textResult.data) {
      console.error('Blog text generation failed:', textResult)
      throw new Error(textResult.error || 'Failed to generate blog text')
    }

    console.log('Blog data structure:', textResult.data)
    const blogData = textResult.data as BlogGenerationResult
    console.log('Blog data after cast:', blogData)

    // Validate blog data structure
    if (!blogData.blog) {
      console.error('Invalid blog data structure. Expected {blog: {...}}, got:', blogData)
      throw new Error('Invalid API response structure for blog generation')
    }

    if (!blogData.blog.title || !blogData.blog.content) {
      console.error('Missing required blog fields:', blogData.blog)
      throw new Error('API response missing required blog fields (title or content)')
    }

    // Step 3: Generate image (16:9 for blog header)
    onProgress?.({ step: 'image', progress: 70, message: 'Generating blog header image...' })
    const imagePrompt = buildImagePrompt(
      'blog',
      blogData.blog.title,
      blogData.blog.summary || blogData.blog.content.substring(0, 200),
      options.brandPrimaryColor,
      options.brandSecondaryColor
    )

    const imageResult = await generateImage({
      prompt: imagePrompt,
      model: 'ideogram/v3',
      endpoint: 'ideogram/v3',
      imageSize: 'landscape_16_9',
      style: 'DESIGN',
      renderingSpeed: 'TURBO',
      expandPrompt: true,
    })

    onProgress?.({ step: 'complete', progress: 100, message: 'Blog generation complete!' })

    return {
      success: true,
      data: {
        title: blogData.blog.title,
        content: blogData.blog.content,
        framework: blogData.blog.framework || 'Standard',
        summary: blogData.blog.summary || blogData.blog.title,
        imageUrl: imageResult.data?.image_url,
      },
    }
  } catch (err) {
    console.error('Blog generation error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate blog',
    }
  }
}

// ==================== Carousel Generation ====================

export interface CarouselResult {
  hook: string
  body: string
  slides: Array<{ sheet: number; text: string }>
  pdfUrl?: string
}

export async function generateCarouselContent(
  options: GenerationOptions,
  onProgress?: ProgressCallback
): Promise<GenerationServiceResult<CarouselResult>> {
  try {
    // Step 1: Combine resources
    onProgress?.({ step: 'resources', progress: 10, message: 'Collecting resources...' })
    const inputText = combineResources(options.resources)

    if (!inputText.trim()) {
      throw new Error('No resource content available')
    }

    // Step 2: Generate carousel content
    onProgress?.({ step: 'text', progress: 30, message: 'Generating carousel slides...' })
    const placeholders = buildPlaceholders(options, inputText)

    // Get configuration from central config
    const config = getGenerationConfig('carousel')
    const prompt = fillTemplate(config.promptTemplate, placeholders)

    const textResult = await generateText({
      ...getAPIConfig('carousel'),
      prompt,
    })

    if (!textResult.success || !textResult.data) {
      throw new Error(textResult.error || 'Failed to generate carousel text')
    }

    const carouselData = textResult.data as CarouselGenerationResult

    // Step 3: Generate PDF
    onProgress?.({ step: 'pdf', progress: 70, message: 'Generating carousel PDF...' })
    const pdfResult = await generateCarousel({
      slides: carouselData.carousel,
      theme: options.carouselTheme || 'default',
      ...options.carouselSettings,
    })

    onProgress?.({ step: 'complete', progress: 100, message: 'Carousel generation complete!' })

    return {
      success: true,
      data: {
        hook: carouselData.hook,
        body: carouselData.body,
        slides: carouselData.carousel,
        pdfUrl: pdfResult.data?.url,
      },
    }
  } catch (err) {
    console.error('Carousel generation error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate carousel',
    }
  }
}

// ==================== Short Video Generation ====================

export interface VideoResult {
  title: string
  body: string
  sentences: Array<{
    sheet: number
    text: string
    visual_cue: string
    image_url: string | null
  }>
  callToAction: string
  videoUrl?: string
}

export async function generateShortVideo(
  options: GenerationOptions,
  onProgress?: ProgressCallback
): Promise<GenerationServiceResult<VideoResult>> {
  try {
    // Step 1: Combine resources
    onProgress?.({ step: 'resources', progress: 5, message: 'Collecting resources...' })
    const inputText = combineResources(options.resources)

    if (!inputText.trim()) {
      throw new Error('No resource content available')
    }

    // Step 2: Generate transcript
    onProgress?.({ step: 'text', progress: 15, message: 'Generating video transcript...' })
    const placeholders = buildPlaceholders(options, inputText)

    // Get configuration from central config
    const config = getGenerationConfig('shortvideo')
    const prompt = fillTemplate(config.promptTemplate, placeholders)

    const textResult = await generateText({
      ...getAPIConfig('shortvideo'),
      prompt,
    })

    if (!textResult.success || !textResult.data) {
      throw new Error(textResult.error || 'Failed to generate video transcript')
    }

    const videoData = textResult.data as VideoTranscriptResult

    // Step 3: Generate images for each sentence (parallel)
    onProgress?.({
      step: 'images',
      progress: 40,
      message: `Generating images for ${videoData.video_transcript.sentences.length} scenes...`,
    })

    const sentencesWithImages = await Promise.all(
      videoData.video_transcript.sentences.map(async (sentence, index) => {
        try {
          const imageResult = await generateImageQuick({
            prompt: sentence.visual_cue,
            model: 'flux/schnell',
            endpoint: 'flux/schnell',
            imageSize: 'portrait_16_9',
          })

          onProgress?.({
            step: 'images',
            progress: 40 + ((index + 1) / videoData.video_transcript.sentences.length) * 30,
            message: `Generated image ${index + 1}/${videoData.video_transcript.sentences.length}`,
          })

          return {
            ...sentence,
            image_url: imageResult.data?.image_url || null,
          }
        } catch (err) {
          console.error(`Failed to generate image for sentence ${index}:`, err)
          return sentence
        }
      })
    )

    // Step 4: Generate video
    onProgress?.({ step: 'video', progress: 75, message: 'Assembling video...' })
    const videoResult = await generateVideo({
      sentences: sentencesWithImages,
      theme: options.videoTheme || 'default',
      ...options.videoSettings,
    })

    onProgress?.({ step: 'complete', progress: 100, message: 'Video generation complete!' })

    return {
      success: true,
      data: {
        title: videoData.video_transcript.title,
        body: videoData.video_transcript.body,
        sentences: sentencesWithImages,
        callToAction: videoData.video_transcript.call_to_action,
        videoUrl: videoResult.data?.video_url,
      },
    }
  } catch (err) {
    console.error('Video generation error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate video',
    }
  }
}
