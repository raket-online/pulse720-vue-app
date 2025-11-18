import { supabase } from '@/lib/supabase'

export interface StorageServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<StorageServiceResult<string>> {
  try {
    // Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true, // Overwrite if exists
    })

    if (error) throw error

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      success: true,
      data: publicUrl,
    }
  } catch (err) {
    console.error('Error uploading file:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to upload file',
    }
  }
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<StorageServiceResult> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error

    return {
      success: true,
    }
  } catch (err) {
    console.error('Error deleting file:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete file',
    }
  }
}

/**
 * Generate a safe filename from company name and original filename
 */
export function generateLogoFilename(companyName: string, originalFilename: string): string {
  // Remove special characters and spaces from company name
  const safeName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')

  // Get file extension
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'png'

  // Generate timestamp to ensure uniqueness
  const timestamp = Date.now()

  return `company_logo_${safeName}_${timestamp}.${extension}`
}
