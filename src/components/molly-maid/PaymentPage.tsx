import React from 'react';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentPageProps {
  paymentData: PaymentData;
  handlePaymentInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentSubmit: (e: React.FormEvent) => void;
  quotationAmount?: number;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ 
  paymentData, 
  handlePaymentInputChange, 
  handlePaymentSubmit,
  quotationAmount = 150.00
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Complete Your Payment</h1>
        <p className="text-xl text-gray-600">
          Secure payment for your cleaning service
        </p>
      </div>

      {/* Quotation Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-[#071D49]">Service Quotation</h3>
            <p className="text-sm text-gray-600">Standard Cleaning Package</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#071D49]">${quotationAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Amount</p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePaymentSubmit}>
        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
          {/* Security Notice */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg p-4">
            <Lock className="text-green-600" size={20} />
            <p className="text-sm text-green-700">
              <strong>Secure Payment:</strong> Your payment information is encrypted and secure
            </p>
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">
              Card Number *
            </label>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none pl-12"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">
              Cardholder Name *
            </label>
            <input
              type="text"
              name="cardName"
              value={paymentData.cardName}
              onChange={handlePaymentInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#071D49]">
                Expiry Date *
              </label>
              <input
                type="text"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={handlePaymentInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#071D49]">
                CVV *
              </label>
              <input
                type="text"
                name="cvv"
                value={paymentData.cvv}
                onChange={handlePaymentInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg flex items-center justify-center gap-2"
          >
            <Lock size={20} />
            Pay ${quotationAmount.toFixed(2)} Securely
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By completing this payment, you agree to our Terms of Service and Privacy Policy.
            Your payment is processed securely and your card details are never stored.
          </p>
        </div>
      </form>

      {/* Additional Info */}
      <div className="mt-8 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2 text-blue-800">What's Next?</h3>
        <ul className="space-y-2 text-blue-700">
          <li>✓ You'll receive a confirmation email immediately</li>
          <li>✓ Our team will contact you within 24 hours to schedule your service</li>
          <li>✓ Access your booking details anytime</li>
        </ul>
      </div>
    </div>
  );
};
