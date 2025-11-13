import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Database types (will be expanded as we build)
export interface Database {
  public: {
    Tables: {
      pillars: {
        Row: {
          id: string
          user_id: string
          title: string
          score: number | null
          advice: string | null
          create_date: string
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          score?: number | null
          advice?: string | null
          create_date?: string
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          score?: number | null
          advice?: string | null
          create_date?: string
          last_updated?: string
        }
      }
      resources: {
        Row: {
          id: string
          pillar_id: string
          filename: string | null
          file_url: string | null
          title: string
          content: string
          image_url: string | null
          score: number | null
          advice: string | null
          added_at: string
        }
      }
      content: {
        Row: {
          id: string
          pillar_id: string
          user_id: string
          type: string
          title: string
          hook: string | null
          media_url: string | null
          keywords: string | null
          visual_description: string | null
          content: string
          json_content: any | null
          added_at: string
        }
      }
      content_schedule: {
        Row: {
          content_id: string
          platform: string
          scheduled_for: string
          status: string
          published_at: string | null
          platform_post_id: string | null
          error_message: string | null
          approved_by: string | null
          approved_at: string | null
        }
      }
      users_profile: {
        Row: {
          id: string
          settings: any | null
          company_name: string | null
          company_website: string | null
          target_audience: string | null
          output_language: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
          superuser: boolean
        }
      }
      linkedin_profiles: {
        Row: {
          user_id: string
          [key: string]: any
        }
      }
    }
  }
}

// Convenience type exports
export type Pillar = Database['public']['Tables']['pillars']['Row']
export type PillarInsert = Database['public']['Tables']['pillars']['Insert']
export type PillarUpdate = Database['public']['Tables']['pillars']['Update']
export type Resource = Database['public']['Tables']['resources']['Row']
export type Content = Database['public']['Tables']['content']['Row']
export type ContentSchedule = Database['public']['Tables']['content_schedule']['Row']
export type UserProfile = Database['public']['Tables']['users_profile']['Row']
