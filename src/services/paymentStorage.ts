/**
 * In-memory database for storing payment details
 * This is a simple key-value store that persists payment information during the session
 */

interface PaymentRecord {
  appointmentId: string;
  quotationId: string;
  service: string;
  amount: number;
  cardLastFour: string;
  cardName: string;
  customerName: string;
  customerEmail: string;
  paymentDate: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

// In-memory storage (Map provides O(1) lookup)
const paymentDatabase = new Map<string, PaymentRecord>();

/**
 * Store a payment record
 * @param appointmentId The appointment ID
 * @param paymentData The payment details to store
 */
export const storePaymentRecord = (appointmentId: string, paymentData: Omit<PaymentRecord, 'timestamp' | 'status'>): void => {
  const record: PaymentRecord = {
    ...paymentData,
    timestamp: Date.now(),
    status: 'completed'
  };
  
  paymentDatabase.set(appointmentId, record);
  console.log(`💾 Payment record stored for appointment ${appointmentId}`, record);
};

/**
 * Retrieve a payment record by appointment ID
 * @param appointmentId The appointment ID
 * @returns The payment record or undefined if not found
 */
export const getPaymentRecord = (appointmentId: string): PaymentRecord | undefined => {
  const record = paymentDatabase.get(appointmentId);
  console.log(`🔍 Payment record lookup for ${appointmentId}:`, record ? 'Found' : 'Not found');
  return record;
};

/**
 * Check if a payment exists for an appointment
 * @param appointmentId The appointment ID
 * @returns True if payment exists, false otherwise
 */
export const hasPaymentRecord = (appointmentId: string): boolean => {
  return paymentDatabase.has(appointmentId);
};

/**
 * Get all payment records (for admin/debugging purposes)
 * @returns Array of all payment records
 */
export const getAllPaymentRecords = (): PaymentRecord[] => {
  return Array.from(paymentDatabase.values());
};

/**
 * Clear all payment records (for testing/reset purposes)
 */
export const clearAllPaymentRecords = (): void => {
  paymentDatabase.clear();
  console.log('🗑️ All payment records cleared');
};

/**
 * Delete a specific payment record
 * @param appointmentId The appointment ID
 * @returns True if record was deleted, false if it didn't exist
 */
export const deletePaymentRecord = (appointmentId: string): boolean => {
  const deleted = paymentDatabase.delete(appointmentId);
  if (deleted) {
    console.log(`🗑️ Payment record deleted for appointment ${appointmentId}`);
  }
  return deleted;
};

// Export type for use in components
export type { PaymentRecord };
