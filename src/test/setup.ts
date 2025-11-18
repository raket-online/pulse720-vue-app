import { vi } from 'vitest'

// Mock environment variables
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')
vi.stubEnv('VITE_API_BASE_URL', 'https://api.contento.expert')
vi.stubEnv('VITE_PULSE720_API_URL', 'https://api.pulse720.com')
vi.stubEnv('VITE_DEEPGRAM_API_KEY', 'test-deepgram-key')

// Mock fetch globally
global.fetch = vi.fn()

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})
