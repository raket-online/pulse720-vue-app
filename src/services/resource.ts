import { supabase } from '@/lib/supabase'
import type { Resource } from '@/lib/supabase'

export interface ResourceServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface CreateResourceData {
  pillar_id: string
  title: string
  content: string
  filename?: string
  file_url?: string
  image_url?: string
  score?: number
  advice?: string
}

/**
 * Fetch all resources for a pillar
 */
export async function fetchResources(pillarId: string): Promise<ResourceServiceResult<Resource[]>> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('pillar_id', pillarId)
      .order('added_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (err) {
    console.error('Error fetching resources:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch resources'
    }
  }
}

/**
 * Fetch a single resource by ID
 */
export async function fetchResourceById(id: string): Promise<ResourceServiceResult<Resource>> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (err) {
    console.error('Error fetching resource:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch resource'
    }
  }
}

/**
 * Create a new resource
 */
export async function createResource(
  resourceData: CreateResourceData
): Promise<ResourceServiceResult<Resource>> {
  try {
    // Validate required fields
    if (!resourceData.pillar_id || !resourceData.title || !resourceData.content) {
      throw new Error('Pillar ID, title, and content are required')
    }

    if (resourceData.content.trim().length < 50) {
      throw new Error('Resource content must be at least 50 characters')
    }

    const { data, error } = await supabase
      .from('resources')
      .insert({
        pillar_id: resourceData.pillar_id,
        title: resourceData.title.trim(),
        content: resourceData.content.trim(),
        filename: resourceData.filename || null,
        file_url: resourceData.file_url || null,
        image_url: resourceData.image_url || null,
        score: resourceData.score ?? null,
        advice: resourceData.advice || null,
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (err) {
    console.error('Error creating resource:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create resource'
    }
  }
}

/**
 * Update an existing resource
 */
export async function updateResource(
  id: string,
  updates: Partial<CreateResourceData>
): Promise<ResourceServiceResult<Resource>> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (err) {
    console.error('Error updating resource:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update resource'
    }
  }
}

/**
 * Delete a resource
 */
export async function deleteResource(id: string): Promise<ResourceServiceResult> {
  try {
    if (!id) {
      throw new Error('Resource ID is required')
    }

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  } catch (err) {
    console.error('Error deleting resource:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete resource'
    }
  }
}
