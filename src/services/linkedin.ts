import { supabase } from '@/lib/supabase'

export interface LinkedInServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface LinkedInProfile {
  user_id: string
  linkedin_id?: string
  access_token?: string
  refresh_token?: string
  expires_at?: string
  profile_data?: any
  connected_at?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.contento.expert'

/**
 * Get LinkedIn OAuth authorization URL
 */
export function getLinkedInAuthUrl(userId: string, redirectUri: string): string {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID

  if (!clientId) {
    console.error('LinkedIn Client ID not configured')
    return ''
  }

  const state = btoa(JSON.stringify({ userId, timestamp: Date.now() }))
  const scope = 'openid profile email w_member_social'

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: scope
  })

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
}

/**
 * Exchange LinkedIn authorization code for access token
 */
export async function exchangeLinkedInCode(
  code: string,
  redirectUri: string
): Promise<LinkedInServiceResult<{ access_token: string; expires_in: number }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/linkedin/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: redirectUri
      }),
    })

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        access_token: data.access_token,
        expires_in: data.expires_in
      }
    }
  } catch (err) {
    console.error('LinkedIn token exchange error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to exchange authorization code'
    }
  }
}

/**
 * Get LinkedIn user profile
 */
export async function getLinkedInProfile(
  accessToken: string
): Promise<LinkedInServiceResult<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/linkedin/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get profile: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data
    }
  } catch (err) {
    console.error('LinkedIn profile fetch error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch LinkedIn profile'
    }
  }
}

/**
 * Save LinkedIn profile to database
 */
export async function saveLinkedInProfile(
  userId: string,
  accessToken: string,
  expiresIn: number,
  profileData: any
): Promise<LinkedInServiceResult> {
  try {
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    const { error } = await supabase
      .from('linkedin_profiles')
      .upsert({
        user_id: userId,
        linkedin_id: profileData.sub || profileData.id,
        access_token: accessToken,
        expires_at: expiresAt,
        profile_data: profileData,
        connected_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error

    return {
      success: true
    }
  } catch (err) {
    console.error('Error saving LinkedIn profile:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save LinkedIn profile'
    }
  }
}

/**
 * Get saved LinkedIn profile from database
 */
export async function getStoredLinkedInProfile(
  userId: string
): Promise<LinkedInServiceResult<LinkedInProfile>> {
  try {
    const { data, error } = await supabase
      .from('linkedin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return {
          success: true,
          data: undefined
        }
      }
      throw error
    }

    return {
      success: true,
      data: data as LinkedInProfile
    }
  } catch (err) {
    console.error('Error fetching stored LinkedIn profile:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch LinkedIn profile'
    }
  }
}

/**
 * Disconnect LinkedIn account
 */
export async function disconnectLinkedIn(userId: string): Promise<LinkedInServiceResult> {
  try {
    const { error } = await supabase
      .from('linkedin_profiles')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    return {
      success: true
    }
  } catch (err) {
    console.error('Error disconnecting LinkedIn:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to disconnect LinkedIn'
    }
  }
}

/**
 * Post content to LinkedIn
 */
export async function postToLinkedIn(
  accessToken: string,
  content: {
    text: string
    visibility?: 'PUBLIC' | 'CONNECTIONS'
  }
): Promise<LinkedInServiceResult<{ postId: string; url: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/linkedin/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content.text,
        visibility: content.visibility || 'PUBLIC'
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Post failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        postId: data.id,
        url: data.url || `https://www.linkedin.com/feed/update/${data.id}`
      }
    }
  } catch (err) {
    console.error('LinkedIn post error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to post to LinkedIn'
    }
  }
}

/**
 * Check if access token is expired
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) <= new Date()
}
