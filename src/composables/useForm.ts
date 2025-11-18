import { ref, computed, type Ref } from 'vue'
import type { FormState } from '@/types/utils'

type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K]) => string | null
}

/**
 * Composable for form state management with validation
 */
export function useForm<T extends Record<string, any>>(
  initialData: T,
  validationRules?: ValidationRules<T>
) {
  const data: Ref<T> = ref({ ...initialData }) as Ref<T>
  const errors: Ref<Partial<Record<keyof T, string>>> = ref({})
  const touched: Ref<Partial<Record<keyof T, boolean>>> = ref({})
  const isSubmitting = ref(false)

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  const formState = computed<FormState<T>>(() => ({
    data: data.value,
    errors: errors.value,
    touched: touched.value,
    isSubmitting: isSubmitting.value,
    isValid: isValid.value,
  }))

  function validateField(field: keyof T): string | null {
    if (!validationRules?.[field]) return null

    const error = validationRules[field]!(data.value[field])

    if (error) {
      errors.value[field] = error
    } else {
      delete errors.value[field]
    }

    return error
  }

  function validateAll(): boolean {
    if (!validationRules) return true

    errors.value = {}

    Object.keys(validationRules).forEach((field) => {
      validateField(field as keyof T)
    })

    return isValid.value
  }

  function setFieldValue<K extends keyof T>(field: K, value: T[K]) {
    data.value[field] = value
    touched.value[field] = true

    if (validationRules?.[field]) {
      validateField(field)
    }
  }

  function setFieldTouched(field: keyof T, isTouched = true) {
    touched.value[field] = isTouched
  }

  function setFieldError(field: keyof T, error: string | null) {
    if (error) {
      errors.value[field] = error
    } else {
      delete errors.value[field]
    }
  }

  function reset() {
    data.value = { ...initialData }
    errors.value = {}
    touched.value = {}
    isSubmitting.value = false
  }

  async function handleSubmit<R>(submitFn: (data: T) => Promise<R>): Promise<R | null> {
    if (!validateAll()) {
      return null
    }

    isSubmitting.value = true

    try {
      const result = await submitFn(data.value)
      reset()
      return result
    } catch (error) {
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    data,
    errors,
    touched,
    isSubmitting,
    isValid,
    formState,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateAll,
    reset,
    handleSubmit,
  }
}
