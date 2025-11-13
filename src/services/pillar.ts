import { supabase } from '@/lib/supabase'
import type { Pillar, PillarInsert, PillarUpdate } from '@/lib/supabase'

export interface PillarServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Fetch all pillars for the current user
 */
export async function fetchPillars(userId: string): Promise<PillarServiceResult<Pillar[]>> {
  try {
    const { data, error } = await supabase
      .from('pillars')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (err) {
    console.error('Error fetching pillars:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch pillars'
    }
  }
}

/**
 * Fetch a single pillar by ID
 */
export async function fetchPillarById(id: string): Promise<PillarServiceResult<Pillar>> {
  try {
    const { data, error } = await supabase
      .from('pillars')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (err) {
    console.error('Error fetching pillar:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch pillar'
    }
  }
}

/**
 * Create a new pillar
 */
export async function createPillar(
  userId: string,
  title: string
): Promise<PillarServiceResult<Pillar>> {
  try {
    // Validate input
    if (!title || title.trim().length === 0) {
      throw new Error('Pillar title is required')
    }

    const pillarData: PillarInsert = {
      user_id: userId,
      title: title.trim(),
      score: null,
      advice: null
    }

    const { data, error } = await supabase
      .from('pillars')
      .insert(pillarData)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (err) {
    console.error('Error creating pillar:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create pillar'
    }
  }
}

/**
 * Update an existing pillar
 */
export async function updatePillar(
  id: string,
  updates: PillarUpdate
): Promise<PillarServiceResult<Pillar>> {
  try {
    // Validate title if provided
    if (updates.title !== undefined && (!updates.title || updates.title.trim().length === 0)) {
      throw new Error('Pillar title cannot be empty')
    }

    // Prepare update data with last_updated timestamp
    const updateData: PillarUpdate = {
      ...updates,
      last_updated: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('pillars')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (err) {
    console.error('Error updating pillar:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update pillar'
    }
  }
}

/**
 * Delete a pillar
 */
export async function deletePillar(id: string): Promise<PillarServiceResult> {
  try {
    if (!id) {
      throw new Error('Pillar ID is required')
    }

    const { error } = await supabase
      .from('pillars')
      .delete()
      .eq('id', id)

    if (error) throw error

    return {
      success: true
    }
  } catch (err) {
    console.error('Error deleting pillar:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete pillar'
    }
  }
}

/**
 * Update pillar score and advice (typically after resource evaluation)
 */
export async function updatePillarEvaluation(
  id: string,
  score: number,
  advice: string
): Promise<PillarServiceResult<Pillar>> {
  try {
    return await updatePillar(id, {
      score,
      advice,
      last_updated: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error updating pillar evaluation:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update pillar evaluation'
    }
  }
}
