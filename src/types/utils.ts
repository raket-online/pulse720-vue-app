/**
 * Utility Types for better type safety across the application
 */

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Make specific keys required
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

// Make specific keys optional
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Extract promise type
export type Awaited<T> = T extends Promise<infer U> ? U : T

// NonNullable for nested properties
export type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>
}

// API Response wrapper
export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Form state
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

// Async state
export interface AsyncState<T, E = Error> {
  data: T | null
  loading: boolean
  error: E | null
}

// Filter operators for generic filtering
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in'

export interface Filter<T> {
  field: keyof T
  operator: FilterOperator
  value: any
}

// Sort options
export type SortDirection = 'asc' | 'desc'

export interface SortOption<T> {
  field: keyof T
  direction: SortDirection
}

// Extract array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : never

// Make readonly
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// Remove readonly
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

// Type-safe keys
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

// Optional properties
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Type guard helper
export type TypeGuard<T> = (value: unknown) => value is T

// Extract function parameters
export type FunctionParams<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never

// Extract function return type
export type FunctionReturn<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never
