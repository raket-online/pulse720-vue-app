import { createPinia } from 'pinia'

// Create pinia instance
export const pinia = createPinia()

// Export all stores
export * from './auth'
export * from './app'
export * from './pillar'
