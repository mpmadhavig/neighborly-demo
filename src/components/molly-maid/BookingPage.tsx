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
}

export const BookingPage: React.FC<BookingPageProps> = ({ 
  formData, 
  handleInputChange, 
  handleSubmit,
  showOtpInput = false,
  otp = '',
  setOtp,
  handleOtpSubmit
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Request a Free Estimate</h1>
      <p className="text-xl text-gray-600 mb-8">
        Fill out the form below and we'll contact you to schedule your cleaning service
      </p>

      {showOtpInput ? (
        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
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
            onClick={handleOtpSubmit}
            className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
          >
            Verify OTP
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
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
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
          >
            Request Free Estimate
          </button>
        </div>
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
