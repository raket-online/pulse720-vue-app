import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPillar, fetchPillars, updatePillar, deletePillar } from '../pillar'
import { supabase } from '@/lib/supabase'

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('Pillar Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createPillar', () => {
    it('should create a pillar successfully', async () => {
      const mockPillar = {
        id: '123',
        user_id: 'user-123',
        title: 'Test Pillar',
        score: null,
        advice: null,
        create_date: '2025-11-18T00:00:00Z',
        last_updated: '2025-11-18T00:00:00Z',
      }

      const mockSupabaseChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockPillar, error: null }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any)

      const result = await createPillar('user-123', 'Test Pillar')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPillar)
      expect(supabase.from).toHaveBeenCalledWith('pillars')
    })

    it('should handle validation error for empty title', async () => {
      const result = await createPillar('user-123', '')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Pillar title is required')
    })

    it('should handle Supabase errors', async () => {
      const mockError = new Error('Database error')
      const mockSupabaseChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any)

      const result = await createPillar('user-123', 'Test Pillar')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })
  })

  describe('fetchPillars', () => {
    it('should fetch pillars successfully', async () => {
      const mockPillars = [
        {
          id: '1',
          user_id: 'user-123',
          title: 'Pillar 1',
          score: 8,
          advice: 'Good coverage',
          create_date: '2025-11-18T00:00:00Z',
          last_updated: '2025-11-18T00:00:00Z',
        },
        {
          id: '2',
          user_id: 'user-123',
          title: 'Pillar 2',
          score: null,
          advice: null,
          create_date: '2025-11-17T00:00:00Z',
          last_updated: '2025-11-17T00:00:00Z',
        },
      ]

      const mockSupabaseChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockPillars, error: null }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any)

      const result = await fetchPillars('user-123')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockPillars)
      expect(result.data?.length).toBe(2)
    })
  })

  describe('updatePillar', () => {
    it('should update pillar successfully', async () => {
      const mockUpdatedPillar = {
        id: '123',
        user_id: 'user-123',
        title: 'Updated Title',
        score: 9,
        advice: 'Great!',
        create_date: '2025-11-18T00:00:00Z',
        last_updated: '2025-11-18T01:00:00Z',
      }

      const mockSupabaseChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockUpdatedPillar, error: null }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any)

      const result = await updatePillar('123', { title: 'Updated Title' })

      expect(result.success).toBe(true)
      expect(result.data?.title).toBe('Updated Title')
    })

    it('should reject empty title', async () => {
      const result = await updatePillar('123', { title: '' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Pillar title cannot be empty')
    })
  })

  describe('deletePillar', () => {
    it('should delete pillar successfully', async () => {
      const mockSupabaseChain = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }

      vi.mocked(supabase.from).mockReturnValue(mockSupabaseChain as any)

      const result = await deletePillar('123')

      expect(result.success).toBe(true)
      expect(supabase.from).toHaveBeenCalledWith('pillars')
    })

    it('should validate pillar ID', async () => {
      const result = await deletePillar('')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Pillar ID is required')
    })
  })
})
