import React from 'react';

interface FormData {
  email: string;
  zipCode: string;
  address: string;
}

interface BookingPageProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  showOtpInput?: boolean;
  otp?: string;
  setOtp?: (otp: string) => void;
  handleOtpSubmit?: (e: React.FormEvent) => void;
  showSuccessBanner?: boolean;
  handleSignIn?: () => void;
  handleAcceptQuotation?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ 
  formData, 
  handleInputChange, 
  handleSubmit,
  showOtpInput = false,
  otp = '',
  setOtp,
  handleOtpSubmit,
  showSuccessBanner = false,
  handleSignIn,
  handleAcceptQuotation
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Request a Free Estimate</h1>
      <p className="text-xl text-gray-600 mb-8">
        Fill out the form below and we'll contact you to schedule your cleaning service
      </p>

      {showSuccessBanner ? (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Registration Successful!</h2>
            <p className="text-lg text-green-700 mb-4">
              Your quotation has been sent to your email. Check your inbox for details.
            </p>
            <p className="text-md text-green-600 mb-6">
              📧 Access your email to view the quotation, or sign in to your dashboard.
            </p>
            
            {/* Quotation Summary */}
            <div className="bg-white border-2 border-green-400 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-[#071D49] mb-4">Your Quotation</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-700">Standard Cleaning</span>
                  <span className="font-semibold">$80.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Bathroom Cleaning</span>
                  <span className="font-semibold">$50.00</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Special Discount</span>
                  <span className="font-semibold">-$20.00</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 mt-2 flex justify-between text-xl font-bold text-[#071D49]">
                  <span>Total</span>
                  <span>$150.00</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleAcceptQuotation}
                className="bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
              >
                Accept & Proceed to Payment
              </button>
              <button
                onClick={handleSignIn}
                className="bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
              >
                Sign In to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : showOtpInput ? (
        <form onSubmit={handleOtpSubmit} className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-[#071D49] mb-2">Verify Your Email</h2>
            <p className="text-gray-600">Enter the OTP sent to your email</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">OTP Code *</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp?.(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
          >
            Verify OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
              placeholder="123 Main St, City, State"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Zip Code *</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
              placeholder="12345"
              maxLength={10}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
          >
            Request Free Estimate
          </button>
        </form>
      )}

      <div className="mt-8 bg-green-50 border-2 border-green-300 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2 text-green-800">The Neighborly Done Right Promise®</h3>
        <p className="text-green-700">
          If your service isn't right, contact us by the next business day and we'll make it right, 
          at no extra cost. Guaranteed satisfaction or your money back.
        </p>
      </div>
    </div>
  );
};
