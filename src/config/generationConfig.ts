/**
 * Central Configuration for AI Content Generation
 *
 * This file contains all API provider settings, model configurations,
 * and prompt templates for each content type.
 *
 * Benefits:
 * - Single source of truth for generation settings
 * - Easy to switch providers or models
 * - Type-safe configuration
 * - Supports fallback providers
 * - Ready for A/B testing and optimization
 */

import {
  SOCIAL_POST_TEMPLATE,
  BLOG_POST_TEMPLATE,
  CAROUSEL_TEMPLATE,
  SHORT_VIDEO_TEMPLATE,
} from '@/services/prompts'

// ==================== Types ====================

export type Provider = 'gemini' | 'openai' | 'anthropic' | 'grok'
export type ContentType = 'post' | 'blog' | 'carousel' | 'shortvideo'

export interface APIConfig {
  provider: Provider
  model: string
  temperature: number
  max_tokens: number
  json_format: boolean
}

export interface FallbackConfig {
  provider: Provider
  model: string
}

export interface GenerationConfig extends APIConfig {
  promptTemplate: string
  fallback?: FallbackConfig
  description?: string
}

// ==================== Default Configuration ====================

/**
 * Default API settings used across all content types
 * Can be overridden per content type
 */
const DEFAULT_API_CONFIG: APIConfig = {
  provider: 'gemini',
  model: 'gemini-2.5-pro',
  temperature: 1.0,
  max_tokens: 5000,
  json_format: true,
}

// ==================== Content Type Configurations ====================

/**
 * Social Post Configuration
 * - Short-form content (2300-2700 chars)
 * - High creativity for engagement
 * - JSON output with structured fields
 */
const POST_CONFIG: GenerationConfig = {
  ...DEFAULT_API_CONFIG,
  promptTemplate: SOCIAL_POST_TEMPLATE,
  description: 'Social media post generation with high engagement focus',
}

/**
 * Blog Article Configuration
 * - Long-form content (1200+ words)
 * - Higher token limit for comprehensive articles
 * - Slightly lower temperature for coherence
 */
const BLOG_CONFIG: GenerationConfig = {
  ...DEFAULT_API_CONFIG,
  max_tokens: 8000, // Blogs need more tokens
  temperature: 0.9, // Slightly more focused
  promptTemplate: BLOG_POST_TEMPLATE,
  description: 'Blog article generation with comprehensive coverage',
}

/**
 * Carousel Configuration
 * - 5-8 slides with concise messaging
 * - Higher creativity for LinkedIn engagement
 * - Structured JSON for slide content
 */
const CAROUSEL_CONFIG: GenerationConfig = {
  ...DEFAULT_API_CONFIG,
  temperature: 1.1, // More creative for slides
  promptTemplate: CAROUSEL_TEMPLATE,
  description: 'LinkedIn carousel slide generation',
}

/**
 * Short Video Configuration
 * - Video transcript with visual cues
 * - 60-90 second duration
 * - Sentence-by-sentence breakdown
 */
const VIDEO_CONFIG: GenerationConfig = {
  ...DEFAULT_API_CONFIG,
  max_tokens: 4000, // Videos are shorter
  temperature: 0.95, // Balanced creativity
  promptTemplate: SHORT_VIDEO_TEMPLATE,
  description: 'Short video transcript generation with visual cues',
  // Example fallback if primary provider fails
  // fallback: {
  //   provider: 'openai',
  //   model: 'gpt-4-turbo-preview',
  // },
}

// ==================== Configuration Map ====================

/**
 * Main configuration object
 * Maps content types to their specific configurations
 */
export const GENERATION_CONFIGS: Record<ContentType, GenerationConfig> = {
  post: POST_CONFIG,
  blog: BLOG_CONFIG,
  carousel: CAROUSEL_CONFIG,
  shortvideo: VIDEO_CONFIG,
}

// ==================== Helper Functions ====================

/**
 * Get configuration for a specific content type
 *
 * @param contentType - The type of content to generate
 * @returns The configuration object for that content type
 *
 * @example
 * ```typescript
 * const config = getGenerationConfig('post')
 * console.log(config.model) // 'gemini-2.5-pro'
 * console.log(config.temperature) // 1.0
 * ```
 */
export function getGenerationConfig(contentType: ContentType): GenerationConfig {
  return GENERATION_CONFIGS[contentType]
}

/**
 * Get API configuration without prompt template
 * Useful for the generation service layer
 *
 * @param contentType - The type of content to generate
 * @returns API configuration only (no prompt template)
 */
export function getAPIConfig(contentType: ContentType): APIConfig {
  const config = GENERATION_CONFIGS[contentType]
  return {
    provider: config.provider,
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.max_tokens,
    json_format: config.json_format,
  }
}

/**
 * Get all available providers
 * Useful for configuration UI or debugging
 */
export function getAvailableProviders(): Provider[] {
  return ['gemini', 'openai', 'anthropic', 'grok']
}

/**
 * Validate configuration
 * Ensures all required fields are present
 */
export function validateConfig(config: GenerationConfig): boolean {
  return !!(
    config.provider &&
    config.model &&
    config.temperature >= 0 &&
    config.temperature <= 2 &&
    config.max_tokens > 0 &&
    config.promptTemplate
  )
}

// ==================== Export Default ====================

export default GENERATION_CONFIGS
