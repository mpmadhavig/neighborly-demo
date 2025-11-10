// Test script for payment confirmation email
import fetch from 'node-fetch';

const testPaymentEmail = async () => {
  try {
    console.log('🧪 Testing payment confirmation email...');
    
    const response = await fetch('http://localhost:3001/api/send-payment-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com', // Change this to your test email
        quotationId: 'Q-2025-001',
        service: 'Deep Cleaning Service',
        serviceDate: 'Nov 10, 2025',
        customerName: 'Test User',
        amount: 150.00,
        paymentDate: new Date().toLocaleDateString()
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testPaymentEmail();
