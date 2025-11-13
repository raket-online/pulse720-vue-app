import { supabase } from '@/lib/supabase'
import type { Content } from '@/lib/supabase'

export interface ContentServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface CreateContentData {
  pillar_id: string
  user_id: string
  type: string
  title: string
  content: string
  hook?: string
  media_url?: string
  keywords?: string
  visual_description?: string
  json_content?: any
}

/**
 * Fetch all content for a user
 */
export async function fetchContents(userId: string): Promise<ContentServiceResult<Content[]>> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (err) {
    console.error('Error fetching contents:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch contents'
    }
  }
}

/**
 * Fetch content by pillar
 */
export async function fetchContentsByPillar(pillarId: string): Promise<ContentServiceResult<Content[]>> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('pillar_id', pillarId)
      .order('added_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (err) {
    console.error('Error fetching contents by pillar:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch contents'
    }
  }
}

/**
 * Fetch a single content by ID
 */
export async function fetchContentById(id: string): Promise<ContentServiceResult<Content>> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined
    }
  } catch (err) {
    console.error('Error fetching content:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch content'
    }
  }
}

/**
 * Create a new content
 */
export async function createContent(contentData: CreateContentData): Promise<ContentServiceResult<Content>> {
  try {
    // Validate required fields
    if (!contentData.pillar_id || !contentData.user_id) {
      throw new Error('Pillar ID and User ID are required')
    }

    if (!contentData.title || contentData.title.trim().length === 0) {
      throw new Error('Title is required')
    }

    if (!contentData.content || contentData.content.trim().length < 10) {
      throw new Error('Content must be at least 10 characters long')
    }

    const { data, error } = await supabase
      .from('content')
      .insert([contentData])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined
    }
  } catch (err) {
    console.error('Error creating content:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create content'
    }
  }
}

/**
 * Update an existing content
 */
export async function updateContent(
  id: string,
  updates: Partial<CreateContentData>
): Promise<ContentServiceResult<Content>> {
  try {
    if (!id) {
      throw new Error('Content ID is required')
    }

    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined
    }
  } catch (err) {
    console.error('Error updating content:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update content'
    }
  }
}

/**
 * Delete a content
 */
export async function deleteContent(id: string): Promise<ContentServiceResult> {
  try {
    if (!id) {
      throw new Error('Content ID is required')
    }

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  } catch (err) {
    console.error('Error deleting content:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete content'
    }
  }
}
