/**
 * Content Generation Service
 * Handles API calls to https://api.pulse720.com/api/...
 */

const API_BASE_URL = 'https://api.pulse720.com/api'

export interface GenerationServiceResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

// ==================== Text Generation ====================

export interface TextGenerationParams {
  provider: string
  model: string
  prompt: string
  temperature?: number
  max_tokens?: number
}

export interface PostGenerationResult {
  post: {
    title: string
    hook: string
    content: string
    summary: string
    keywords: string
  }
}

export interface BlogGenerationResult {
  blog: {
    title: string
    content: string
    framework: string
    summary: string
  }
}

export interface CarouselSlide {
  sheet: number
  text: string
}

export interface CarouselGenerationResult {
  carousel: CarouselSlide[]
  body: string
  hook: string
}

export interface VideoSentence {
  sheet: number
  text: string
  visual_cue: string
  image_url: string | null
}

export interface VideoTranscriptResult {
  video_transcript: {
    title: string
    duration_seconds: number
    body: string
    sentences: VideoSentence[]
    call_to_action: string
  }
}

/**
 * Generate text content using Gemini 2.5 Pro
 */
export async function generateText(
  params: TextGenerationParams
): Promise<GenerationServiceResult<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: params.provider || 'google',
        model: params.model || 'gemini-2.0-flash-exp',
        prompt: params.prompt,
        temperature: params.temperature ?? 0.8,
        max_tokens: params.max_tokens || 4000,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()

    // Parse JSON response from completion
    let parsedData
    try {
      parsedData =
        typeof data.completion === 'string' ? JSON.parse(data.completion) : data.completion
    } catch {
      console.error('Failed to parse completion JSON:', data.completion)
      throw new Error('Invalid JSON in API response')
    }

    return {
      success: true,
      data: parsedData,
    }
  } catch (err) {
    console.error('Text generation error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate text',
    }
  }
}

// ==================== Image Generation ====================

export interface ImageGenerationParams {
  prompt: string
  model?: string
  size?: string
  aspectRatio?: string
  numImages?: number
}

export interface ImageGenerationResult {
  image_url: string
}

/**
 * Generate high-quality image using FAL AI (ideogram/v3)
 */
export async function generateImage(
  params: ImageGenerationParams
): Promise<GenerationServiceResult<ImageGenerationResult>> {
  try {
    const response = await fetch(`${API_BASE_URL}/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        model: params.model || 'fal-ai/ideogram/v3',
        size: params.size || '1024x1024',
        aspect_ratio: params.aspectRatio || 'ASPECT_1_1',
        num_images: params.numImages || 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        image_url: data.image_url || data.url,
      },
    }
  } catch (err) {
    console.error('Image generation error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate image',
    }
  }
}

/**
 * Generate quick image using FAL AI (flux/schnell)
 */
export async function generateImageQuick(
  params: ImageGenerationParams
): Promise<GenerationServiceResult<ImageGenerationResult>> {
  try {
    const response = await fetch(`${API_BASE_URL}/image-quick`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        model: params.model || 'fal-ai/flux/schnell',
        image_size: params.size || 'square_hd',
        num_inference_steps: 4,
        num_images: params.numImages || 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`Quick image generation failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        image_url: data.image_url || data.url,
      },
    }
  } catch (err) {
    console.error('Quick image generation error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate quick image',
    }
  }
}

// ==================== Carousel Generation ====================

export interface CarouselGenerationParams {
  slides: CarouselSlide[]
  theme?: string
  // Custom theme settings
  textColor?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundOpacity?: number
  font?: string
  fontSize?: number
  border?: boolean
  borderColor?: string
  borderWidth?: number
  logoUrl?: string
  logoPosition?: string
  logoOpacity?: number
  arrow?: boolean
  arrowColor?: string
  arrowOpacity?: number
}

export interface CarouselResult {
  relative_path: string
  url: string
}

/**
 * Generate carousel PDF
 */
export async function generateCarousel(
  params: CarouselGenerationParams
): Promise<GenerationServiceResult<CarouselResult>> {
  try {
    const response = await fetch(`${API_BASE_URL}/carousel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slides: params.slides,
        theme: params.theme || 'default',
        settings:
          params.theme === 'custom'
            ? {
                textColor: params.textColor,
                backgroundColor: params.backgroundColor,
                backgroundImage: params.backgroundImage,
                backgroundOpacity: params.backgroundOpacity,
                font: params.font,
                fontSize: params.fontSize,
                border: params.border,
                borderColor: params.borderColor,
                borderWidth: params.borderWidth,
                logoUrl: params.logoUrl,
                logoPosition: params.logoPosition,
                logoOpacity: params.logoOpacity,
                arrow: params.arrow,
                arrowColor: params.arrowColor,
                arrowOpacity: params.arrowOpacity,
              }
            : undefined,
      }),
    })

    if (!response.ok) {
      throw new Error(`Carousel generation failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        relative_path: data.relative_path,
        url: data.url || data.relative_path,
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

// ==================== Video Generation ====================

export interface VideoGenerationParams {
  sentences: VideoSentence[]
  theme?: string
  voiceName?: string
  voiceVolume?: number
  speakingRate?: number
  music?: string
  musicVolume?: number
  // Custom theme settings
  font?: string
  fontSize?: number
  textColor?: string
  highlightColor?: string
  enableSubtitles?: boolean
  subtitleBoxes?: boolean
  subtitleStyle?: string
  uppercase?: boolean
}

export interface VideoResult {
  video_url: string
}

/**
 * Generate short video
 */
export async function generateVideo(
  params: VideoGenerationParams
): Promise<GenerationServiceResult<VideoResult>> {
  try {
    const response = await fetch(`${API_BASE_URL}/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentences: params.sentences,
        theme: params.theme || 'default',
        voice: {
          name: params.voiceName || 'Achird',
          volume: params.voiceVolume ?? 1.0,
          speakingRate: params.speakingRate ?? 1.0,
        },
        music: {
          file: params.music || '',
          volume: params.musicVolume ?? 0.2,
        },
        settings:
          params.theme === 'custom'
            ? {
                font: params.font,
                fontSize: params.fontSize,
                textColor: params.textColor,
                highlightColor: params.highlightColor,
                enableSubtitles: params.enableSubtitles,
                subtitleBoxes: params.subtitleBoxes,
                subtitleStyle: params.subtitleStyle,
                uppercase: params.uppercase,
              }
            : undefined,
      }),
    })

    if (!response.ok) {
      throw new Error(`Video generation failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        video_url: data.video_url || data.url,
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
