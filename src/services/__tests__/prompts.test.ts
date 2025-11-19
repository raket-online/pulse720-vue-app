import { describe, it, expect } from 'vitest'
import {
  fillTemplate,
  SOCIAL_POST_TEMPLATE,
  BLOG_POST_TEMPLATE,
  CAROUSEL_TEMPLATE,
  SHORT_VIDEO_TEMPLATE,
  POST_IMAGE_PROMPT_TEMPLATE,
  BLOG_IMAGE_PROMPT_TEMPLATE,
  IMAGE_PRESETS,
  WRITING_STYLES,
} from '../prompts'

describe('Prompt Templates', () => {
  describe('fillTemplate', () => {
    it('should replace all placeholders with provided values', () => {
      const template = 'Hello #NAME#, welcome to #PLACE#!'
      const result = fillTemplate(template, {
        SUBJECT: 'Test',
      })

      // NAME and PLACE are not in placeholders, so they should remain
      expect(result).toBe('Hello #NAME#, welcome to #PLACE#!')
    })

    it('should replace TARGET_MARKET placeholder', () => {
      const template = 'Target market is #TARGET_MARKET#'
      const result = fillTemplate(template, {
        TARGET_MARKET: 'B2B SaaS companies',
      })

      expect(result).toBe('Target market is B2B SaaS companies')
    })

    it('should replace multiple occurrences of the same placeholder', () => {
      const template = '#LANGUAGE# is great. I love #LANGUAGE#!'
      const result = fillTemplate(template, {
        LANGUAGE: 'Dutch',
      })

      expect(result).toBe('Dutch is great. I love Dutch!')
    })

    it('should handle undefined placeholders gracefully', () => {
      const template = 'Style: #STYLE#, Language: #LANGUAGE#'
      const result = fillTemplate(template, {
        STYLE: 'professional',
      })

      expect(result).toBe('Style: professional, Language: #LANGUAGE#')
    })
  })

  describe('Template Structure', () => {
    it('SOCIAL_POST_TEMPLATE should contain required placeholders', () => {
      expect(SOCIAL_POST_TEMPLATE).toContain('#TARGET_MARKET#')
      expect(SOCIAL_POST_TEMPLATE).toContain('#LANGUAGE#')
      expect(SOCIAL_POST_TEMPLATE).toContain('#STYLE#')
      expect(SOCIAL_POST_TEMPLATE).toContain('#INPUT_TEXT#')
    })

    it('BLOG_POST_TEMPLATE should contain required placeholders', () => {
      expect(BLOG_POST_TEMPLATE).toContain('#TARGET_MARKET#')
      expect(BLOG_POST_TEMPLATE).toContain('#LANGUAGE#')
      expect(BLOG_POST_TEMPLATE).toContain('#STYLE#')
      expect(BLOG_POST_TEMPLATE).toContain('#INPUT_TEXT#')
    })

    it('CAROUSEL_TEMPLATE should contain required placeholders', () => {
      expect(CAROUSEL_TEMPLATE).toContain('#TARGET_MARKET#')
      expect(CAROUSEL_TEMPLATE).toContain('#LANGUAGE#')
      expect(CAROUSEL_TEMPLATE).toContain('#STYLE#')
      expect(CAROUSEL_TEMPLATE).toContain('#INPUT_TEXT#')
    })

    it('SHORT_VIDEO_TEMPLATE should contain required placeholders', () => {
      expect(SHORT_VIDEO_TEMPLATE).toContain('#TARGET_MARKET#')
      expect(SHORT_VIDEO_TEMPLATE).toContain('#LANGUAGE#')
      expect(SHORT_VIDEO_TEMPLATE).toContain('#STYLE#')
      expect(SHORT_VIDEO_TEMPLATE).toContain('#INPUT_TEXT#')
    })
  })

  describe('Image Prompt Templates', () => {
    it('POST_IMAGE_PROMPT_TEMPLATE should contain color placeholders', () => {
      expect(POST_IMAGE_PROMPT_TEMPLATE).toContain('#PRIMARY_COLOR#')
      expect(POST_IMAGE_PROMPT_TEMPLATE).toContain('#SECONDARY_COLOR#')
      expect(POST_IMAGE_PROMPT_TEMPLATE).toContain('#SUBJECT#')
      expect(POST_IMAGE_PROMPT_TEMPLATE).toContain('#VISUAL_DESCRIPTION#')
    })

    it('BLOG_IMAGE_PROMPT_TEMPLATE should contain color placeholders', () => {
      expect(BLOG_IMAGE_PROMPT_TEMPLATE).toContain('#PRIMARY_COLOR#')
      expect(BLOG_IMAGE_PROMPT_TEMPLATE).toContain('#SECONDARY_COLOR#')
      expect(BLOG_IMAGE_PROMPT_TEMPLATE).toContain('#SUBJECT#')
      expect(BLOG_IMAGE_PROMPT_TEMPLATE).toContain('#VISUAL_DESCRIPTION#')
    })
  })

  describe('Image Presets', () => {
    it('should have post preset with correct configuration', () => {
      const preset = IMAGE_PRESETS.post

      expect(preset).toBeDefined()
      expect(preset.name).toBe('Social Post')
      expect(preset.model).toBe('fal-ai/ideogram/v3')
      expect(preset.size).toBe('1024x1024')
      expect(preset.promptTemplate).toBe(POST_IMAGE_PROMPT_TEMPLATE)
    })

    it('should have blog preset with 16:9 size', () => {
      const preset = IMAGE_PRESETS.blog

      expect(preset).toBeDefined()
      expect(preset.name).toBe('Blog Header')
      expect(preset.model).toBe('fal-ai/ideogram/v3')
      expect(preset.size).toBe('1792x1024')
    })

    it('should have video_frame preset with flux/schnell model', () => {
      const preset = IMAGE_PRESETS.video_frame

      expect(preset).toBeDefined()
      expect(preset.name).toBe('Video Frame')
      expect(preset.model).toBe('fal-ai/flux/schnell')
      expect(preset.size).toBe('1072x1344')
    })

    it('should have all required presets', () => {
      expect(IMAGE_PRESETS.post).toBeDefined()
      expect(IMAGE_PRESETS.blog).toBeDefined()
      expect(IMAGE_PRESETS.carousel).toBeDefined()
      expect(IMAGE_PRESETS.video_frame).toBeDefined()
    })
  })

  describe('Writing Styles', () => {
    it('should have at least 7 writing styles', () => {
      expect(WRITING_STYLES.length).toBeGreaterThanOrEqual(7)
    })

    it('should have professional style', () => {
      const professional = WRITING_STYLES.find((s) => s.value === 'professional')
      expect(professional).toBeDefined()
      expect(professional?.label).toContain('Professional')
    })

    it('should have conversational style', () => {
      const conversational = WRITING_STYLES.find((s) => s.value === 'conversational')
      expect(conversational).toBeDefined()
      expect(conversational?.label).toContain('Conversational')
    })

    it('all styles should have value and label', () => {
      WRITING_STYLES.forEach((style) => {
        expect(style.value).toBeDefined()
        expect(style.label).toBeDefined()
        expect(typeof style.value).toBe('string')
        expect(typeof style.label).toBe('string')
      })
    })
  })

  describe('Template Content Requirements', () => {
    it('SOCIAL_POST_TEMPLATE should mention JSON output', () => {
      expect(SOCIAL_POST_TEMPLATE).toContain('JSON')
      expect(SOCIAL_POST_TEMPLATE).toContain('post')
    })

    it('SOCIAL_POST_TEMPLATE should specify character limit', () => {
      expect(SOCIAL_POST_TEMPLATE).toContain('2900')
      expect(SOCIAL_POST_TEMPLATE).toContain('2300')
    })

    it('BLOG_POST_TEMPLATE should specify word count', () => {
      expect(BLOG_POST_TEMPLATE).toContain('1200')
    })

    it('CAROUSEL_TEMPLATE should specify slide count', () => {
      expect(CAROUSEL_TEMPLATE).toContain('5')
      expect(CAROUSEL_TEMPLATE).toContain('8')
    })

    it('SHORT_VIDEO_TEMPLATE should specify duration', () => {
      expect(SHORT_VIDEO_TEMPLATE).toContain('70')
      expect(SHORT_VIDEO_TEMPLATE).toContain('seconden')
    })
  })
})
