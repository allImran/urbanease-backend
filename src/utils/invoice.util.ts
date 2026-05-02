/**
 * Generates a unique invoice number for Steadfast courier
 * Format: ALPHA-{timestamp}-{random}
 * Example: INV-20240327-AB3X
 *
 * Requirements:
 * - Must be unique
 * - Can be alpha-numeric including hyphens and underscores
 * - Examples from Steadfast: 12366, abc123, 12abchd, Aa12-das4, a_sdfd-wq
 */
export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()

  return `${prefix}-${timestamp}-${randomStr}`
}

/**
 * Validates invoice number format according to Steadfast requirements
 * - Can be alpha-numeric
 * - Can include hyphens and underscores
 * - Must not be empty
 * - Must not contain spaces or special characters other than hyphen and underscore
 */
export function isValidInvoiceFormat(invoice: string): boolean {
  if (!invoice || invoice.trim() === '') {
    return false
  }

  // Allow alphanumeric, hyphens, and underscores only
  const invoiceRegex = /^[a-zA-Z0-9_-]+$/
  return invoiceRegex.test(invoice)
}
