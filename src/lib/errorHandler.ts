/**
 * Centralized Error Handling Service
 *
 * Provides utilities for logging, reporting, and handling errors throughout the app
 */

export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

export type ErrorSeverity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity]

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  metadata?: Record<string, any>
}

export interface AppError {
  message: string
  stack?: string
  severity: ErrorSeverity
  context?: ErrorContext
  timestamp: Date
  handled: boolean
}

class ErrorHandlerService {
  private errors: AppError[] = []
  private maxStoredErrors = 100
  private sentryEnabled = false

  /**
   * Initialize error handler with optional Sentry configuration
   */
  initialize(config?: { sentryDsn?: string }) {
    if (config?.sentryDsn) {
      this.sentryEnabled = true
      // Sentry will be initialized in main.ts if DSN is provided
    }

    // Setup global error listeners
    this.setupGlobalHandlers()
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(event.reason?.message || 'Unhandled Promise Rejection'),
        ErrorSeverity.HIGH,
        {
          action: 'unhandledRejection',
          metadata: { reason: event.reason },
        }
      )

      // Prevent console error
      event.preventDefault()
    })

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), ErrorSeverity.HIGH, {
        action: 'globalError',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      })
    })
  }

  /**
   * Capture and log an error
   */
  captureError(
    error: Error | string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: ErrorContext
  ): void {
    const errorObj: AppError = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      severity,
      context,
      timestamp: new Date(),
      handled: true,
    }

    // Store error locally
    this.storeError(errorObj)

    // Log to console in development
    if (import.meta.env.DEV) {
      this.logToConsole(errorObj)
    }

    // Report to Sentry if enabled
    if (this.sentryEnabled && typeof error !== 'string') {
      this.reportToSentry(error, severity, context)
    }

    // For critical errors, show user notification
    if (severity === ErrorSeverity.CRITICAL) {
      this.notifyUser(errorObj)
    }
  }

  /**
   * Store error in memory (limited history)
   */
  private storeError(error: AppError): void {
    this.errors.unshift(error)

    if (this.errors.length > this.maxStoredErrors) {
      this.errors = this.errors.slice(0, this.maxStoredErrors)
    }
  }

  /**
   * Log error to console
   */
  private logToConsole(error: AppError): void {
    const style = this.getConsoleStyle(error.severity)

    console.groupCollapsed(`%c[${error.severity.toUpperCase()}] ${error.message}`, style)
    console.log('Timestamp:', error.timestamp.toISOString())

    if (error.context) {
      console.log('Context:', error.context)
    }

    if (error.stack) {
      console.log('Stack:', error.stack)
    }

    console.groupEnd()
  }

  /**
   * Get console styling based on severity
   */
  private getConsoleStyle(severity: ErrorSeverity): string {
    const styles = {
      [ErrorSeverity.LOW]: 'color: #3b82f6; font-weight: bold',
      [ErrorSeverity.MEDIUM]: 'color: #f59e0b; font-weight: bold',
      [ErrorSeverity.HIGH]: 'color: #ef4444; font-weight: bold',
      [ErrorSeverity.CRITICAL]: 'color: #dc2626; font-weight: bold; font-size: 14px',
    }

    return styles[severity]
  }

  /**
   * Report error to Sentry (if configured)
   */
  private reportToSentry(_error: Error, _severity: ErrorSeverity, context?: ErrorContext): void {
    // Sentry reporting will be handled by Sentry SDK
    // This is a placeholder for additional custom logic if needed
    if (context) {
      // Add context as breadcrumbs or tags
      console.debug('Sentry context:', context)
    }
  }

  /**
   * Notify user of critical errors
   */
  private notifyUser(error: AppError): void {
    // This will be implemented with a toast/notification system
    // For now, just alert (will be replaced with proper UI component)
    if (import.meta.env.PROD) {
      alert(`Critical Error: ${error.message}\nPlease refresh the page or contact support.`)
    }
  }

  /**
   * Get recent errors (for debug panel)
   */
  getRecentErrors(limit: number = 10): AppError[] {
    return this.errors.slice(0, limit)
  }

  /**
   * Clear error history
   */
  clearErrors(): void {
    this.errors = []
  }

  /**
   * Handle service/API errors with user-friendly messages
   */
  handleServiceError(error: unknown, defaultMessage: string = 'An error occurred'): string {
    if (error instanceof Error) {
      // Check for common API errors
      if (error.message.includes('Failed to fetch')) {
        return 'Network error. Please check your internet connection.'
      }

      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.'
      }

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        return 'Session expired. Please log in again.'
      }

      if (error.message.includes('403') || error.message.includes('forbidden')) {
        return "You don't have permission to perform this action."
      }

      if (error.message.includes('404')) {
        return 'Resource not found.'
      }

      if (error.message.includes('500')) {
        return 'Server error. Please try again later.'
      }

      // Return the actual error message for other cases
      return error.message || defaultMessage
    }

    return defaultMessage
  }

  /**
   * Create a safe async wrapper that handles errors
   */
  wrapAsync<T>(fn: () => Promise<T>, context?: ErrorContext): Promise<T | null> {
    return fn().catch((error) => {
      this.captureError(error, ErrorSeverity.MEDIUM, context)
      return null
    })
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandlerService()
