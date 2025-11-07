import React, { useState } from 'react';
import { User, Phone, Edit2, Check } from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

interface ProfileFormPageProps {
  profileData: ProfileData;
  handleProfileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  isProfileFromToken?: boolean;
}

export const ProfileFormPage: React.FC<ProfileFormPageProps> = ({ 
  profileData, 
  handleProfileInputChange, 
  handleProfileSubmit,
  isLoading = false,
  isProfileFromToken = false
}) => {
  // Check if all required fields are filled
  const isProfileComplete = profileData.firstName && profileData.lastName && profileData.mobileNumber;
  
  // State to track if fields are editable
  const [isEditable, setIsEditable] = useState(!isProfileFromToken);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Complete Your Profile</h1>
        <p className="text-xl text-gray-600">
          {isProfileComplete 
            ? 'Your profile information is complete. Review and proceed to payment.'
            : 'Please provide your details to continue with the booking'
          }
        </p>
      </div>

      {/* Success Banner if profile is already complete */}
      {isProfileComplete && isProfileFromToken && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Profile Information Found!</h3>
              <p className="text-sm text-green-700">
                We've pre-filled your profile information from your account. You can update any field if needed, or proceed directly to payment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      {!isProfileComplete && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <User className="text-blue-600 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-[#071D49] mb-2">Why do we need this?</h3>
              <p className="text-sm text-gray-700">
                Your contact information helps us provide better service and keep you updated about your booking.
                This information will be securely stored in your profile.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit}>
        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
          {/* Edit Button - Show only if profile is pre-filled from token */}
          {isProfileFromToken && !isEditable && (
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
                readOnly={!isEditable}
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none pl-12 ${
                  isEditable 
                    ? 'border-gray-300 focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] bg-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-700 cursor-default'
                }`}
                placeholder="John"
                required
              />
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${isEditable ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              {!isEditable && (
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
                readOnly={!isEditable}
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none pl-12 ${
                  isEditable 
                    ? 'border-gray-300 focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] bg-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-700 cursor-default'
                }`}
                placeholder="Doe"
                required
              />
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${isEditable ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              {!isEditable && (
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
                readOnly={!isEditable}
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none pl-12 ${
                  isEditable 
                    ? 'border-gray-300 focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] bg-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-700 cursor-default'
                }`}
                placeholder="+1 (555) 123-4567"
                required
              />
              <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 ${isEditable ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              {!isEditable && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          {/* Submit Button */}
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

          {!isProfileComplete && (
            <p className="text-sm text-center text-gray-600">
              All fields are required to proceed to payment
            </p>
          )}
        </div>
      </form>

      {/* Privacy Notice */}
      <div className="mt-8 bg-green-50 border-2 border-green-300 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2 text-green-800">🔒 Privacy & Security</h3>
        <p className="text-green-700 text-sm">
          Your personal information is encrypted and stored securely. We will never share your 
          details with third parties without your consent. Read our Privacy Policy for more information.
        </p>
      </div>
    </div>
  );
};
