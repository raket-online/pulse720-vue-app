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
