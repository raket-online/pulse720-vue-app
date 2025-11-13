import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/lib/supabase'

export interface UserProfileServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Fetch user profile
 */
export async function fetchUserProfile(userId: string): Promise<UserProfileServiceResult<UserProfile>> {
  try {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined
    }
  } catch (err) {
    console.error('Error fetching user profile:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch user profile'
    }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    company_name?: string
    company_website?: string
    logo_url?: string
    target_audience?: string
    output_language?: string
  }
): Promise<UserProfileServiceResult<UserProfile>> {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Update timestamp
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('users_profile')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined
    }
  } catch (err) {
    console.error('Error updating user profile:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update user profile'
    }
  }
}

/**
 * Create user profile (called on first login if not exists)
 */
export async function createUserProfile(userId: string): Promise<UserProfileServiceResult<UserProfile>> {
  try {
    const { data, error } = await supabase
      .from('users_profile')
      .insert([{
        id: userId,
        output_language: 'en',
        superuser: false
      }])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined
    }
  } catch (err) {
    console.error('Error creating user profile:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create user profile'
    }
  }
}
