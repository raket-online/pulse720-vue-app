import { describe, it, expect, beforeEach, vi } from 'vitest'
import { errorHandler, ErrorSeverity } from '../errorHandler'

describe('ErrorHandler', () => {
  beforeEach(() => {
    errorHandler.clearErrors()
    vi.clearAllMocks()
  })

  describe('captureError', () => {
    it('should capture string error', () => {
      errorHandler.captureError('Test error', ErrorSeverity.LOW)

      const errors = errorHandler.getRecentErrors()
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toBe('Test error')
      expect(errors[0].severity).toBe(ErrorSeverity.LOW)
    })

    it('should capture Error object', () => {
      const error = new Error('Test error object')
      errorHandler.captureError(error, ErrorSeverity.MEDIUM)

      const errors = errorHandler.getRecentErrors()
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toBe('Test error object')
      expect(errors[0].stack).toBeDefined()
    })

    it('should capture error with context', () => {
      const context = {
        component: 'TestComponent',
        action: 'testAction',
        userId: 'user-123',
        metadata: { key: 'value' },
      }

      errorHandler.captureError('Contextual error', ErrorSeverity.HIGH, context)

      const errors = errorHandler.getRecentErrors()
      expect(errors[0].context).toEqual(context)
    })

    it('should default to MEDIUM severity', () => {
      errorHandler.captureError('Default severity error')

      const errors = errorHandler.getRecentErrors()
      expect(errors[0].severity).toBe(ErrorSeverity.MEDIUM)
    })
  })

  describe('getRecentErrors', () => {
    it('should return limited number of errors', () => {
      // Add 20 errors
      for (let i = 0; i < 20; i++) {
        errorHandler.captureError(`Error ${i}`, ErrorSeverity.LOW)
      }

      const recentErrors = errorHandler.getRecentErrors(5)
      expect(recentErrors).toHaveLength(5)
    })

    it('should return errors in reverse chronological order', () => {
      errorHandler.captureError('First error', ErrorSeverity.LOW)
      errorHandler.captureError('Second error', ErrorSeverity.LOW)
      errorHandler.captureError('Third error', ErrorSeverity.LOW)

      const errors = errorHandler.getRecentErrors()
      expect(errors[0].message).toBe('Third error')
      expect(errors[1].message).toBe('Second error')
      expect(errors[2].message).toBe('First error')
    })
  })

  describe('clearErrors', () => {
    it('should clear all stored errors', () => {
      errorHandler.captureError('Error 1', ErrorSeverity.LOW)
      errorHandler.captureError('Error 2', ErrorSeverity.LOW)

      expect(errorHandler.getRecentErrors()).toHaveLength(2)

      errorHandler.clearErrors()
      expect(errorHandler.getRecentErrors()).toHaveLength(0)
    })
  })

  describe('handleServiceError', () => {
    it('should return default message for non-Error input', () => {
      const result = errorHandler.handleServiceError('not an error', 'Default')
      expect(result).toBe('Default')
    })

    it('should detect network errors', () => {
      const error = new Error('Failed to fetch')
      const result = errorHandler.handleServiceError(error)
      expect(result).toContain('Network error')
    })

    it('should detect timeout errors', () => {
      const error = new Error('Request timeout exceeded')
      const result = errorHandler.handleServiceError(error)
      expect(result).toContain('timed out')
    })

    it('should detect 401 unauthorized errors', () => {
      const error = new Error('401 unauthorized')
      const result = errorHandler.handleServiceError(error)
      expect(result).toContain('Session expired')
    })

    it('should detect 403 forbidden errors', () => {
      const error = new Error('403 forbidden')
      const result = errorHandler.handleServiceError(error)
      expect(result).toContain('permission')
    })

    it('should detect 404 not found errors', () => {
      const error = new Error('404 not found')
      const result = errorHandler.handleServiceError(error)
      expect(result).toContain('not found')
    })

    it('should detect 500 server errors', () => {
      const error = new Error('500 internal server error')
      const result = errorHandler.handleServiceError(error)
      expect(result).toContain('Server error')
    })

    it('should return original message for other errors', () => {
      const error = new Error('Custom error message')
      const result = errorHandler.handleServiceError(error)
      expect(result).toBe('Custom error message')
    })
  })

  describe('wrapAsync', () => {
    it('should return result on success', async () => {
      const fn = async () => 'success'
      const result = await errorHandler.wrapAsync(fn)
      expect(result).toBe('success')
    })

    it('should return null on error and capture it', async () => {
      const fn = async () => {
        throw new Error('Async error')
      }

      const result = await errorHandler.wrapAsync(fn, {
        component: 'TestComponent',
      })

      expect(result).toBeNull()

      const errors = errorHandler.getRecentErrors()
      expect(errors).toHaveLength(1)
      expect(errors[0].message).toBe('Async error')
      expect(errors[0].context?.component).toBe('TestComponent')
    })
  })

  describe('error storage limits', () => {
    it('should limit stored errors to maxStoredErrors', () => {
      // Add 150 errors (more than the 100 limit)
      for (let i = 0; i < 150; i++) {
        errorHandler.captureError(`Error ${i}`, ErrorSeverity.LOW)
      }

      const errors = errorHandler.getRecentErrors(150)
      expect(errors.length).toBeLessThanOrEqual(100)
    })
  })
})
