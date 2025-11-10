import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { Calendar, CheckCircle, User, Mail, Phone, Clock, Edit2 } from 'lucide-react';
import { updateMyProfile } from '@/services/scimService';
import { resendMobileVerificationCode } from '@/services/mobileVerificationService';

interface AppointmentsTabProps {
  preselectedQuotationId?: string | null;
  onShowMobileVerification?: () => void;
}

interface UserInfo {
  given_name?: string;
  family_name?: string;
  email?: string;
  phone_numbers?: string | string[];
  phone_number?: string;
  pendingPhoneNumberVerified?: string;
  phoneNumberVerified?: boolean | string;
  username?: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

interface Quotation {
  id: string;
  service: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ 
  preselectedQuotationId,
  onShowMobileVerification 
}) => {
  const authContext = useAuthContext();
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    mobileNumber: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(preselectedQuotationId || null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [confirmedAppointmentDate, setConfirmedAppointmentDate] = useState('');
  const [confirmedAppointmentTime, setConfirmedAppointmentTime] = useState('');

  // Mock quotations
  const quotations: Quotation[] = [
    {
      id: 'Q-2025-001',
      service: 'Deep Cleaning Service',
      amount: 150.00,
      date: 'Nov 10, 2025',
      status: 'pending'
    },
    {
      id: 'Q-2025-002',
      service: 'Regular Cleaning Service',
      amount: 89.99,
      date: 'Nov 8, 2025',
      status: 'pending'
    }
  ];

  // Load user info
  useEffect(() => {
    const loadUserInfo = async () => {
      if (authContext.state.isAuthenticated) {
        try {
          let info = await authContext.getBasicUserInfo();
          
          if (!info?.given_name || !info?.family_name || !info?.email) {
            try {
              const accessToken = await authContext.getAccessToken();
              const response = await fetch(`https://api.asgardeo.io/t/vihanga3/oauth2/userinfo`, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              });
              if (response.ok) {
                const userinfoData = await response.json();
                info = { ...info, ...userinfoData };
              }
            } catch (error) {
              console.warn('Failed to fetch from userinfo endpoint:', error);
            }
          }
          
          setUserInfo(info || {});
          
          // Check phone verification status
          const phoneNumbers = info?.phone_numbers;
          const phoneNumber = info?.phone_number;
          const phoneVerified = !!(
            (phoneNumbers && (typeof phoneNumbers === 'string' || (Array.isArray(phoneNumbers) && phoneNumbers.length > 0))) ||
            phoneNumber
          );
          setIsPhoneVerified(phoneVerified);
          console.log('Phone number verified status:', phoneVerified);
          
          // Get mobile number from phone_numbers, then phone_number, then pendingPhoneNumberVerified
          const mobileNumber = (
            phoneNumbers 
              ? (typeof phoneNumbers === 'string' ? phoneNumbers : phoneNumbers[0])
              : phoneNumber
          ) || info?.pendingPhoneNumberVerified || '';
          
          // Set profile data from user info
          setProfileData({
            firstName: info?.given_name || '',
            lastName: info?.family_name || '',
            mobileNumber: mobileNumber
          });
        } catch (error) {
          console.error('Error loading user info:', error);
        }
      }
    };

    loadUserInfo();
  }, [authContext]);

  const selectedQuotationData = quotations.find(q => q.id === selectedQuotation);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsUpdatingProfile(true);

    try {
      console.log('Saving profile data:', profileData);

      const accessToken = await authContext.getAccessToken();
      
      if (!accessToken) {
        console.warn('No access token available, skipping profile update');
        setIsEditingProfile(false);
        setUserInfo(prev => ({
          ...prev,
          given_name: profileData.firstName,
          family_name: profileData.lastName,
          phone_number: profileData.mobileNumber
        }));
        return;
      }

      console.log('Attempting to update profile using /Me endpoint');
      
      const result = await updateMyProfile(
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          mobileNumber: profileData.mobileNumber,
        },
        accessToken
      );

      if (!result.success) {
        console.warn('⚠️ Profile update failed:', result.error);
        
        // Update local state anyway
        setUserInfo(prev => ({
          ...prev,
          given_name: profileData.firstName,
          family_name: profileData.lastName,
          phone_numbers: [profileData.mobileNumber]
        }));
        
        // Check if phone is already verified
        if (isPhoneVerified) {
          console.log('📱 Phone number is already verified, no verification needed');
          setIsEditingProfile(false);
        } else {
          // Show mobile verification if phone is not verified
          console.log('📱 Phone number not verified, showing mobile verification');
          setIsEditingProfile(false);
          
          // Send verification code and show verification page
          try {
            console.log('📤 Attempting to send verification code...');
            const sendResult = await resendMobileVerificationCode(accessToken);
            if (sendResult.success) {
              console.log('✅ Verification code sent successfully');
              // Trigger parent to show mobile verification page
              if (onShowMobileVerification) {
                onShowMobileVerification();
              }
            } else {
              console.error('❌ Failed to send verification code:', sendResult.error);
              alert('Failed to send verification code. Please try again.');
            }
          } catch (sendError) {
            console.error('❌ Error sending verification code:', sendError);
            alert('Failed to send verification code. Please try again.');
          }
        }
        return;
      } else {
        console.log('✅ Profile updated successfully in Asgardeo!');
        
        // Update local state with new values
        setUserInfo(prev => ({
          ...prev,
          given_name: profileData.firstName,
          family_name: profileData.lastName,
          phone_numbers: [profileData.mobileNumber]
        }));
      }
      
      // Check if phone is already verified
      if (isPhoneVerified) {
        console.log('📱 Phone number is already verified, skipping mobile verification step');
        setIsEditingProfile(false);
      } else {
        console.log('📱 Phone number not verified, prompting for mobile verification');
        setIsEditingProfile(false);
        
        // Automatically send verification code and show verification page
        try {
          console.log('📤 Sending verification code to mobile number...');
          const sendResult = await resendMobileVerificationCode(accessToken);
          if (sendResult.success) {
            console.log('✅ Verification code sent successfully');
            // Trigger parent to show mobile verification page
            if (onShowMobileVerification) {
              onShowMobileVerification();
            }
          } else {
            console.error('❌ Failed to send verification code:', sendResult.error);
            alert('Failed to send verification code. Please try again.');
          }
        } catch (sendError) {
          console.error('❌ Error sending verification code:', sendError);
          alert('Failed to send verification code. Please try again.');
        }
      }

    } catch (error) {
      console.error('Error in profile submission:', error);
      setIsEditingProfile(false);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate appointment ID
      const newAppointmentId = `APT-${Date.now()}`;
      setAppointmentId(newAppointmentId);

      console.log('Creating appointment...', {
        appointmentId: newAppointmentId,
        quotation: selectedQuotation,
        date: appointmentDate,
        time: appointmentTime,
        customerName: `${userInfo.given_name} ${userInfo.family_name}`,
        email: userInfo.email
      });

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send appointment confirmation email
      try {
        const EMAIL_API_BASE_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001';
        
        const phoneNumbers = userInfo.phone_numbers;
        const phoneNumber = userInfo.phone_number;
        const mobileNumber = (
          phoneNumbers 
            ? (typeof phoneNumbers === 'string' ? phoneNumbers : phoneNumbers[0])
            : phoneNumber
        ) || userInfo.pendingPhoneNumberVerified || '';

        const response = await fetch(`${EMAIL_API_BASE_URL}/api/send-appointment-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userInfo.email || 'customer@example.com',
            appointmentId: newAppointmentId,
            quotationId: selectedQuotationData?.id,
            service: selectedQuotationData?.service,
            amount: selectedQuotationData?.amount,
            appointmentDate: appointmentDate,
            appointmentTime: appointmentTime,
            customerName: `${userInfo.given_name} ${userInfo.family_name}`,
            phoneNumber: mobileNumber
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Appointment confirmation email sent:', result);
        } else {
          console.error('❌ Failed to send appointment email');
        }
      } catch (emailError) {
        console.error('❌ Error sending appointment email:', emailError);
      }

      // Save appointment details for the success modal before resetting
      setConfirmedAppointmentDate(appointmentDate);
      setConfirmedAppointmentTime(appointmentTime);

      // Show success modal
      setShowSuccess(true);

      // Reset form
      setSelectedQuotation(null);
      setAppointmentDate('');
      setAppointmentTime('');

    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUserDetailsComplete = !!(
    userInfo.given_name && 
    userInfo.family_name && 
    userInfo.email
  );

  // Get min date (today) and max date (60 days from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  console.log('AppointmentsTab rendering...', {
    isAuthenticated: authContext.state.isAuthenticated,
    userInfo,
    isUserDetailsComplete
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#071D49] mb-2">
                Appointment Confirmed!
              </h3>
              <p className="text-gray-600 mb-4">
                Your appointment has been scheduled successfully
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appointment ID:</span>
                    <span className="font-semibold text-[#071D49]">{appointmentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold text-[#071D49]">{confirmedAppointmentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-[#071D49]">{confirmedAppointmentTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  📧 Check your email at <strong>{userInfo.email}</strong> for appointment details and payment link
                </p>
              </div>
              
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setAppointmentId(null);
                  setConfirmedAppointmentDate('');
                  setConfirmedAppointmentTime('');
                }}
                className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#071D49] mb-2">Book Appointment</h1>
        <p className="text-gray-600">
          Schedule your service appointment
        </p>
      </div>

      {/* User Details Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#071D49] flex items-center gap-2">
            <User className="w-5 h-5 text-[#CF0557]" />
            {isEditingProfile ? 'Complete Details Before Proceeding' : 'Your Details'}
          </h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-[#071D49] font-semibold"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#071D49] mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#071D49] mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#071D49] mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={profileData.mobileNumber}
                onChange={handleProfileInputChange}
                placeholder="+1234567890"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
              />
              <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isUpdatingProfile}
                className="flex-1 bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  // Reset to original values
                  setProfileData({
                    firstName: userInfo.given_name || '',
                    lastName: userInfo.family_name || '',
                    mobileNumber: (() => {
                      const phoneNumbers = userInfo.phone_numbers;
                      const phoneNumber = userInfo.phone_number;
                      return (
                        phoneNumbers 
                          ? (typeof phoneNumbers === 'string' ? phoneNumbers : phoneNumbers[0])
                          : phoneNumber
                      ) || userInfo.pendingPhoneNumberVerified || '';
                    })()
                  });
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-[#071D49] rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-[#CF0557]" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-[#071D49]">
                  {userInfo.given_name && userInfo.family_name
                    ? `${userInfo.given_name} ${userInfo.family_name}`
                    : 'Not available'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-[#CF0557]" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-[#071D49]">{userInfo.email || 'Not available'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-[#CF0557]" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-[#071D49]">
                  {(() => {
                    const phoneNumbers = userInfo.phone_numbers;
                    const phoneNumber = userInfo.phone_number;
                    return (
                      phoneNumbers 
                        ? (typeof phoneNumbers === 'string' ? phoneNumbers : phoneNumbers[0])
                        : phoneNumber
                    ) || userInfo.pendingPhoneNumberVerified || 'Not available';
                  })()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quotation Selection */}
      <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${!isUserDetailsComplete ? 'opacity-60' : ''}`}>
        <h2 className="text-xl font-bold text-[#071D49] mb-4">Select Service</h2>
        {!isUserDetailsComplete && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Please ensure your profile is complete before booking an appointment.
            </p>
          </div>
        )}
        <div className="space-y-3">
          {quotations.map((quotation) => (
            <div
              key={quotation.id}
              onClick={() => isUserDetailsComplete && setSelectedQuotation(quotation.id)}
              className={`p-4 border-2 rounded-lg transition ${
                !isUserDetailsComplete 
                  ? 'cursor-not-allowed bg-gray-100 border-gray-200'
                  : selectedQuotation === quotation.id
                  ? 'border-[#CF0557] bg-pink-50 cursor-pointer'
                  : 'border-gray-200 hover:border-[#CF0557] hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#071D49]">{quotation.id}</span>
                    {selectedQuotation === quotation.id && (
                      <CheckCircle className="w-5 h-5 text-[#CF0557]" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{quotation.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#CF0557]">
                    ${quotation.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Form */}
      {selectedQuotation && isUserDetailsComplete && (
        <form onSubmit={handleSubmitAppointment} className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#071D49] mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#CF0557]" />
            Schedule Appointment
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-[#071D49] mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={today}
                max={maxDate}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
              />
              <p className="text-xs text-gray-500 mt-1">Select a date within the next 60 days</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#071D49] mb-2">
                Preferred Time *
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
              >
                <option value="">Select time</option>
                <option value="08:00 AM">08:00 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
          </div>

          {/* Selected Service Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-[#071D49] mb-2">Selected Service</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{selectedQuotationData?.id}</p>
                <p className="font-semibold text-[#071D49]">{selectedQuotationData?.service}</p>
              </div>
              <p className="text-2xl font-bold text-[#CF0557]">
                ${selectedQuotationData?.amount.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !appointmentDate || !appointmentTime}
            className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-4 rounded-lg font-bold hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Confirm Appointment
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            📧 You'll receive a confirmation email with appointment details and payment link
          </p>
        </form>
      )}

      {/* No Selection Message */}
      {!selectedQuotation && isUserDetailsComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Please select a service above to schedule your appointment
          </p>
        </div>
      )}
    </div>
  );
};
