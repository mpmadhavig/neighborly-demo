import React, { useState, useRef, useEffect } from 'react';
import { User, Phone, Edit2, Check, CreditCard, Calendar, Lock } from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface ProfileAndPaymentPageProps {
  profileData: ProfileData;
  paymentData: PaymentData;
  handleProfileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileSubmit: (e: React.FormEvent) => void;
  handlePaymentSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  isProfileFromToken?: boolean;
  quotationAmount: number;
  profileSubmitted?: boolean;
  showPayment?: boolean; // Control when to show payment section
  onEditMobileNumber?: () => void; // Callback to edit mobile number
}

export const ProfileAndPaymentPage: React.FC<ProfileAndPaymentPageProps> = ({ 
  profileData, 
  paymentData,
  handleProfileInputChange,
  handlePaymentInputChange, 
  handleProfileSubmit,
  handlePaymentSubmit,
  isLoading = false,
  isProfileFromToken = false,
  quotationAmount,
  profileSubmitted = false,
  showPayment = true,
  onEditMobileNumber
}) => {
  const isProfileComplete = profileData.firstName && profileData.lastName && profileData.mobileNumber;
  const [isEditable, setIsEditable] = useState(!isProfileFromToken);
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  console.log("profileData", profileData);

  // Scroll to payment section when it becomes visible
  useEffect(() => {
    if (profileSubmitted && showPayment && paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [profileSubmitted, showPayment]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Section */}
      <div className={`transition-all duration-300 ${profileSubmitted ? 'opacity-75' : ''}`}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#071D49] flex items-center gap-3">
              {profileSubmitted && <Check className="text-green-600" size={32} />}
              Your Profile
            </h2>
            {profileSubmitted && (
              <p className="text-green-600 font-semibold mt-1">Profile information confirmed</p>
            )}
          </div>
          {profileSubmitted && (
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Completed
            </span>
          )}
        </div>

        {isProfileComplete && isProfileFromToken && !profileSubmitted && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">Profile Information Found!</h3>
                <p className="text-sm text-green-700">
                  We've pre-filled your profile information from your account. You can update any field if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleProfileSubmit}>
          <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
            {isProfileFromToken && !isEditable && !profileSubmitted && (
              <div className="flex justify-end -mt-2 mb-4">
                <button
                  type="button"
                  onClick={() => setIsEditable(true)}
                  className="flex items-center gap-2 text-[#CF0557] hover:text-[#a00444] font-semibold transition"
                >
                  <Edit2 size={18} />
                  Edit Profile Information
                </button>
              </div>
            )}

            {/* Edit Mobile Number button when profile is submitted and payment is showing */}
            {profileSubmitted && showPayment && onEditMobileNumber && (
              <div className="flex justify-end -mt-2 mb-4">
                <button
                  type="button"
                  onClick={onEditMobileNumber}
                  className="flex items-center gap-2 text-[#CF0557] hover:text-[#a00444] font-semibold transition"
                >
                  <Edit2 size={18} />
                  Edit Mobile Number
                </button>
              </div>
            )}

            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#071D49]">
                First Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileInputChange}
                  readOnly={!isEditable || profileSubmitted}
                  className={`w-full px-4 py-3 border-2 rounded-lg outline-none pl-12 ${
                    isEditable && !profileSubmitted
                      ? 'border-gray-300 focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] bg-white' 
                      : 'border-gray-200 bg-gray-50 text-gray-700 cursor-default'
                  }`}
                  placeholder="John"
                  required
                />
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${isEditable && !profileSubmitted ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                {(!isEditable || profileSubmitted) && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
                )}
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#071D49]">
                Last Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileInputChange}
                  readOnly={!isEditable || profileSubmitted}
                  className={`w-full px-4 py-3 border-2 rounded-lg outline-none pl-12 ${
                    isEditable && !profileSubmitted
                      ? 'border-gray-300 focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] bg-white' 
                      : 'border-gray-200 bg-gray-50 text-gray-700 cursor-default'
                  }`}
                  placeholder="Doe"
                  required
                />
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${isEditable && !profileSubmitted ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                {(!isEditable || profileSubmitted) && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#071D49]">
                Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="mobileNumber"
                  value={profileData.mobileNumber}
                  onChange={handleProfileInputChange}
                  readOnly={!isEditable || profileSubmitted}
                  className={`w-full px-4 py-3 border-2 rounded-lg outline-none pl-12 ${
                    isEditable && !profileSubmitted
                      ? 'border-gray-300 focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] bg-white' 
                      : 'border-gray-200 bg-gray-50 text-gray-700 cursor-default'
                  }`}
                  placeholder="+1 (555) 123-4567"
                  required
                />
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 ${isEditable && !profileSubmitted ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                {(!isEditable || profileSubmitted) && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
                )}
              </div>
              {!profileSubmitted && (
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g., +1 for US)
                </p>
              )}
            </div>

            {!profileSubmitted && (
              <button
                type="submit"
                disabled={isLoading || !isProfileComplete}
                className="w-full bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? 'Updating Profile...' 
                  : isProfileComplete 
                    ? 'Continue to Payment Details' 
                    : 'Complete Profile & Continue'
                }
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Payment Section - Only show after profile is submitted and mobile verified */}
      {profileSubmitted && showPayment && (
        <div ref={paymentSectionRef} className="scroll-mt-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#071D49]">Payment Details</h2>
            <p className="text-gray-600 mt-2">Enter your card information to complete the booking</p>
          </div>

          <form onSubmit={handlePaymentSubmit}>
            <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
              {/* Quotation Summary */}
              <div className="bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Amount</p>
                    <p className="text-3xl font-bold">${quotationAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">Professional Cleaning</p>
                    <p className="text-lg">Molly Maid Service</p>
                  </div>
                </div>
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
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#071D49]">
                  Cardholder Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none pl-12"
                    placeholder="JOHN DOE"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#071D49]">
                    Expiry Date *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none pl-12"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#071D49]">
                    CVV *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none pl-12"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Lock className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#CF0557] to-[#a00444] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
              >
                Complete Payment - ${quotationAmount.toFixed(2)}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
