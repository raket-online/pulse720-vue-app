const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.contento.expert'

export interface AIServiceResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface SummaryResult {
  score: number
  advice: string
}

export interface ContentGenerationResult {
  title: string
  content: string
  hook?: string
  keywords?: string
  visual_description?: string
}

/**
 * Call the Contento API for AI completions
 */
async function callAPI(params: {
  provider?: string
  model?: string
  prompt: string
  temperature?: number
  max_tokens?: number
  json_format?: boolean
}): Promise<AIServiceResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: params.provider || 'openai',
        model: params.model || 'gpt-4o-mini',
        prompt: params.prompt,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.max_tokens || 1000,
        json_format: params.json_format ?? false,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      data: data.completion,
    }
  } catch (err) {
    console.error('AI API error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to call AI API',
    }
  }
}

/**
 * Summarize and evaluate resource content
 */
export async function summarizeResource(content: string): Promise<AIServiceResult<SummaryResult>> {
  const prompt = `You are an expert content strategist. Analyze the following content and provide:
1. A score from 1-10 indicating how valuable this resource is for content marketing
2. Specific advice on how to best utilize this resource

Content:
${content}

Respond in JSON format with this structure:
{
  "score": <number 1-10>,
  "advice": "<specific actionable advice>"
}`

  try {
    const result = await callAPI({
      prompt,
      json_format: true,
      temperature: 0.3,
    })

    if (!result.success || !result.data) {
      throw new Error(result.error || 'No data returned')
    }

    // Parse JSON response
    const parsed = typeof result.data === 'string'
      ? JSON.parse(result.data)
      : result.data

    return {
      success: true,
      data: {
        score: parsed.score || 5,
        advice: parsed.advice || 'This resource can be used for content creation.',
      },
    }
  } catch (err) {
    console.error('Error summarizing resource:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to summarize resource',
    }
  }
}

/**
 * Evaluate all resources for a pillar
 */
export async function evaluatePillar(resources: string[]): Promise<AIServiceResult<SummaryResult>> {
  const combinedContent = resources.join('\n\n---\n\n')

  const prompt = `You are an expert content strategist. Analyze these combined resources for a content pillar and provide:
1. An overall score from 1-10 indicating how well-covered this pillar is
2. Specific advice on what types of content or resources are missing

Resources:
${combinedContent}

Respond in JSON format with this structure:
{
  "score": <number 1-10>,
  "advice": "<specific advice on content gaps and opportunities>"
}`

  try {
    const result = await callAPI({
      prompt,
      json_format: true,
      temperature: 0.3,
      max_tokens: 500,
    })

    if (!result.success || !result.data) {
      throw new Error(result.error || 'No data returned')
    }

    const parsed = typeof result.data === 'string'
      ? JSON.parse(result.data)
      : result.data

    return {
      success: true,
      data: {
        score: parsed.score || 5,
        advice: parsed.advice || 'Continue adding diverse resources to strengthen this pillar.',
      },
    }
  } catch (err) {
    console.error('Error evaluating pillar:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to evaluate pillar',
    }
  }
}

/**
 * Crawl a URL and extract text content
 */
export async function crawlURL(url: string): Promise<AIServiceResult<{ text: string; title: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crawl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        max_length: 10000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Crawl request failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to crawl URL')
    }

    return {
      success: true,
      data: {
        text: data.text || '',
        title: data.title || url,
      },
    }
  } catch (err) {
    console.error('URL crawl error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to crawl URL',
    }
  }
}

/**
 * Extract transcript from YouTube video
 */
export async function youtubeTranscript(url: string): Promise<AIServiceResult<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/youtubetranscript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`YouTube transcript request failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data || typeof data !== 'string') {
      throw new Error('Invalid transcript data received')
    }

    return {
      success: true,
      data,
    }
  } catch (err) {
    console.error('YouTube transcript error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to get YouTube transcript. Video may have transcripts disabled.',
    }
  }
}

/**
 * Convert PDF to text
 */
export async function pdfToText(pdfBase64: string, filename: string): Promise<AIServiceResult<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pdf2txt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdf_base64: pdfBase64,
        filename,
      }),
    })

    if (!response.ok) {
      throw new Error(`PDF conversion failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (typeof data !== 'string') {
      throw new Error('Invalid PDF conversion response')
    }

    return {
      success: true,
      data,
    }
  } catch (err) {
    console.error('PDF conversion error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to convert PDF to text',
    }
  }
}

/**
 * Generate content from pillar resources
 */
export async function generateContent(
  contentType: string,
  pillarTitle: string,
  resources: string[],
  userInstructions?: string
): Promise<AIServiceResult<ContentGenerationResult>> {
  const resourcesText = resources.join('\n\n---RESOURCE---\n\n')

  const contentTypePrompts: Record<string, string> = {
    post: `Create an engaging social media post that:
- Has an attention-grabbing first line (hook)
- Is 150-300 words
- Uses line breaks for readability
- Includes 3-5 relevant hashtags at the end
- Is conversational and engaging
- Provides value and insights
- Works well on LinkedIn, Instagram, or Facebook`,

    blog: `Create a comprehensive blog post that:
- Has an SEO-friendly title
- Includes an introduction, main body with sections, and conclusion
- Is 500-800 words
- Uses clear headings and structure
- Provides actionable insights
- Is optimized for engagement and readability`,

    carousel: `Create content for a multi-slide carousel that:
- Has a compelling title slide
- Contains 5-8 slides total
- Each slide has a clear headline and 1-3 key points
- Uses a logical flow from slide to slide
- Ends with a call-to-action or summary
- Provides valuable, actionable information
- Format: Return each slide with "SLIDE X:" prefix`,

    shortvideo: `Create a script for a short-form video (30-60 seconds) that:
- Has a hook in the first 3 seconds
- Includes a clear structure: Hook, Value, CTA
- Is 150-200 words (speaking pace: ~150 words/minute)
- Uses simple, conversational language
- Includes visual cues or B-roll suggestions
- Ends with a strong call-to-action
- Works well for TikTok, Instagram Reels, or YouTube Shorts`
  }

  const typeInstructions = contentTypePrompts[contentType] || contentTypePrompts['post']

  const prompt = `You are an expert content creator. Create engaging ${contentType} content for the pillar "${pillarTitle}" using the following resources.

${typeInstructions}

Additional Instructions: ${userInstructions || 'None'}

Resources:
${resourcesText}

Respond in JSON format with this structure:
{
  "title": "<engaging title or subject line>",
  "content": "<the main content text>",
  "hook": "<optional: the opening hook or first sentence>",
  "keywords": "<optional: comma-separated relevant keywords>",
  "visual_description": "<optional: description of suggested visual/image>"
}`

  try {
    const result = await callAPI({
      prompt,
      json_format: true,
      temperature: 0.8,
      max_tokens: 2000,
    })

    if (!result.success || !result.data) {
      throw new Error(result.error || 'No data returned')
    }

    const parsed = typeof result.data === 'string'
      ? JSON.parse(result.data)
      : result.data

    return {
      success: true,
      data: {
        title: parsed.title || `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Post`,
        content: parsed.content || '',
        hook: parsed.hook,
        keywords: parsed.keywords,
        visual_description: parsed.visual_description,
      },
    }
  } catch (err) {
    console.error('Error generating content:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate content',
    }
  }
}
