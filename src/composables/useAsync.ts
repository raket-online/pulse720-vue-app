import { ref } from 'vue'
import { errorHandler, ErrorSeverity } from '@/lib/errorHandler'

/**
 * Composable for handling async operations with loading, error, and data states
 */
export function useAsync<T, Args extends any[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  options: {
    immediate?: boolean
    initialData?: T | null
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    errorSeverity?: keyof typeof ErrorSeverity
  } = {}
) {
  const { immediate = false, initialData = null, onSuccess, onError, errorSeverity = 'MEDIUM' } =
    options

  const data = ref<T | null>(initialData)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function execute(...args: Args): Promise<T | null> {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFn(...args)
      data.value = result

      onSuccess?.(result)
      return result
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj

      // Log error
      errorHandler.captureError(errorObj, ErrorSeverity[errorSeverity], {
        action: 'useAsync',
      })

      onError?.(errorObj)
      return null
    } finally {
      loading.value = false
    }
  }

  function reset() {
    data.value = initialData
    loading.value = false
    error.value = null
  }

  // Execute immediately if requested
  if (immediate) {
    execute(...([] as unknown as Args))
  }

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}

/**
 * Composable for paginated async operations
 */
export function usePaginatedAsync<T>(
  asyncFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  initialPageSize = 20
) {
  const page = ref(1)
  const pageSize = ref(initialPageSize)
  const total = ref(0)
  const hasMore = ref(true)

  const { data, loading, error, execute: baseExecute } = useAsync(asyncFn)

  async function execute() {
    const result = await baseExecute(page.value, pageSize.value)
    if (result) {
      total.value = result.total
      hasMore.value = page.value * pageSize.value < result.total
    }
    return result
  }

  function nextPage() {
    if (hasMore.value) {
      page.value++
      return execute()
    }
  }

  function prevPage() {
    if (page.value > 1) {
      page.value--
      return execute()
    }
  }

  function goToPage(newPage: number) {
    page.value = newPage
    return execute()
  }

  function reset() {
    page.value = 1
    total.value = 0
    hasMore.value = true
  }

  return {
    data,
    loading,
    error,
    page,
    pageSize,
    total,
    hasMore,
    execute,
    nextPage,
    prevPage,
    goToPage,
    reset,
  }
}
