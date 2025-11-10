import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { CheckCircle, CreditCard, User, Mail, Phone, Edit2 } from 'lucide-react';
import { updateMyProfile } from '@/services/scimService';
import { resendMobileVerificationCode } from '@/services/mobileVerificationService';

interface PaymentsTabProps {
  onPaymentComplete?: () => void;
  preselectedQuotationId?: string | null;
  onShowMobileVerification?: () => void;
}

interface UserInfo {
  given_name?: string;
  family_name?: string;
  email?: string;
  phone_numbers?: string | string[];
  phone_number?: string;
  phoneNumberVerified?: boolean | string;
  pendingPhoneNumberVerified?: string;
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

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ 
  onPaymentComplete, 
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(preselectedQuotationId || null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    quotationId: string;
    service: string;
    amount: number;
  } | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [showConfirmationBanner, setShowConfirmationBanner] = useState(false);

  // Auto-dismiss confirmation banner after modal is closed
  useEffect(() => {
    if (showConfirmationBanner && !showPaymentSuccess) {
      const timer = setTimeout(() => {
        setShowConfirmationBanner(false);
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showConfirmationBanner, showPaymentSuccess]);

  // Mock quotations - In real app, fetch from API
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

  useEffect(() => {
    const loadUserInfo = async () => {
      if (authContext.state.isAuthenticated) {
        try {
          // Get user info from ID token
          let info = await authContext.getBasicUserInfo();
          
          // If no data in ID token, try userinfo endpoint
          if (!info?.given_name || !info?.family_name || !info?.phone_numbers || !info?.pendingPhoneNumberVerified) {
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
          // If phone_numbers or phone_number exists in response, phone is VERIFIED
          // If neither exists but pendingPhoneNumberVerified exists, phone is NOT verified
          const phoneNumbers = info?.phone_numbers;
          const phoneNumber = info?.phone_number;
          const phoneVerified = !!(
            (phoneNumbers && (typeof phoneNumbers === 'string' || (Array.isArray(phoneNumbers) && phoneNumbers.length > 0))) ||
            phoneNumber
          );
          setIsPhoneVerified(phoneVerified);
          console.log('Phone number verified status:', phoneVerified);
          console.log('phone_numbers value:', info?.phone_numbers);
          console.log('phone_number value:', info?.phone_number);
          console.log('pendingPhoneNumberVerified value:', info?.pendingPhoneNumberVerified);
          
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

  const handleInitiateVerification = async () => {
    console.log('📱 Initiating mobile verification...');

    try {
      const accessToken = await authContext.getAccessToken();
      
      if (!accessToken) {
        alert('No access token available');
        return;
      }

      console.log('📤 Sending verification code to mobile number...');
      const result = await resendMobileVerificationCode(accessToken);
      
      if (result.success) {
        console.log('✅ Verification code sent successfully');
        // Trigger parent to show mobile verification page
        if (onShowMobileVerification) {
          onShowMobileVerification();
        }
      } else {
        console.error('❌ Failed to send verification code:', result.error);
        alert('Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('❌ Error sending verification code:', err);
      alert('Failed to send verification code. Please try again.');
    }
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
      } else {
        setPaymentData(prev => ({ ...prev, [name]: cleaned }));
      }
      return;
    }
    
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      console.log('Processing payment...', { quotation: selectedQuotation, paymentData });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get the paid quotation details
      const paidQuotation = quotations.find(q => q.id === selectedQuotation);
      
      if (paidQuotation) {
        // Send confirmation email with bill
        let emailSuccess = false;
        try {
          console.log('📧 Sending payment confirmation email...');
          console.log('Email data:', {
            email: userInfo.email,
            quotationId: paidQuotation.id,
            service: paidQuotation.service,
            serviceDate: paidQuotation.date,
            customerName: `${userInfo.given_name} ${userInfo.family_name}`,
            amount: paidQuotation.amount,
            paymentDate: new Date().toLocaleDateString()
          });

          const EMAIL_API_BASE_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001';
          
          // Call the Express server API to send email
          const response = await fetch(`${EMAIL_API_BASE_URL}/api/send-payment-confirmation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userInfo.email || 'customer@example.com',
              quotationId: paidQuotation.id,
              service: paidQuotation.service,
              serviceDate: paidQuotation.date,
              customerName: `${userInfo.given_name} ${userInfo.family_name}`,
              amount: paidQuotation.amount,
              paymentDate: new Date().toLocaleDateString()
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Email API response:', result);
            
            if (result.success) {
              console.log('✅ Payment confirmation and promotional emails sent successfully');
              emailSuccess = true;
            } else {
              console.error('❌ Failed to send emails:', result.error);
            }
          } else {
            console.error('❌ Email API returned error status:', response.status);
          }
          
        } catch (emailError) {
          console.error('❌ Failed to send emails:', emailError);
          // Don't fail the payment if email fails
        }
        
        // Set email sent status
        setEmailSent(emailSuccess);
        
        // Mark quotation as paid (in a real app, this would be an API call)
        paidQuotation.status = 'paid';
        console.log(`✅ Quotation ${paidQuotation.id} marked as paid`);

        // Show success modal and confirmation banner
        setShowPaymentSuccess(true);
        setShowConfirmationBanner(true);
        
        // Store payment details for success modal
        setPaymentDetails({
          quotationId: paidQuotation.id,
          service: paidQuotation.service,
          amount: paidQuotation.amount
        });
      }
      
      // Reset form
      setPaymentData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      });
      setSelectedQuotation(null);
      
      // Don't call onPaymentComplete here - let user dismiss modal first
      // if (onPaymentComplete) {
      //   onPaymentComplete();
      // }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedQuotationData = quotations.find(q => q.id === selectedQuotation);

  // Check if user details are complete
  const isUserDetailsComplete = !!(
    userInfo.given_name && 
    userInfo.family_name && 
    (userInfo.phone_numbers || userInfo.phone_number || userInfo.pendingPhoneNumberVerified)
  );

  console.log("showConfirmationBanner", showConfirmationBanner)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Payment Confirmation Banner - Fixed at top, above modal */}
      {showConfirmationBanner && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-2xl px-4 animate-slide-down">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-2xl p-4 border-2 border-green-400">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">Payment Confirmed!</h4>
                <p className="text-sm text-green-50 mb-2">
                  Your payment of <strong>${paymentDetails?.amount.toFixed(2)}</strong> for{' '}
                  <strong>{paymentDetails?.quotationId}</strong> has been processed successfully.
                </p>
                {emailSent ? (
                  <p className="text-xs text-green-100 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Payment confirmation sent to {userInfo.email}
                  </p>
                ) : (
                  <p className="text-xs text-yellow-200 flex items-center gap-1">
                    ⚠️ Payment successful, but confirmation email could not be sent. Please contact support if needed.
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowConfirmationBanner(false)}
                className="flex-shrink-0 text-white hover:text-green-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#071D49] mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your booking has been confirmed
              </p>
              
              {paymentDetails && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quotation:</span>
                      <span className="font-semibold text-[#071D49]">{paymentDetails.quotationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-semibold text-[#071D49]">{paymentDetails.service}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-bold text-[#CF0557] text-lg">${paymentDetails.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  {emailSent ? (
                    <>
                      📧 Confirmation emails have been sent to <strong>{userInfo.email}</strong>
                      <br />
                      <span className="text-xs">Check your inbox for payment receipt</span>
                    </>
                  ) : (
                    <>
                      ⚠️ Confirmation email could not be sent. Your payment was successful. 
                      Please check your email or contact support for confirmation.
                    </>
                  )}
                </p>
              </div>
              
              <button
                onClick={() => {
                  setShowPaymentSuccess(false);
                  setPaymentDetails(null);
                  // Keep banner visible for user to dismiss manually
                  // setShowConfirmationBanner(false);
                  if (onPaymentComplete) {
                    onPaymentComplete();
                  }
                }}
                className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#071D49] mb-2">Payments</h1>
        <p className="text-gray-600">
          Select a quotation and complete your payment
        </p>
      </div>

      {/* User Details Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#071D49] flex items-center gap-2">
              <User className="w-5 h-5 text-[#CF0557]" />
              User Details
            </h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-2 text-[#CF0557] hover:text-[#a00444] font-semibold transition text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Details
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                    placeholder="John"
                    required
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                    placeholder="Doe"
                    required
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                  placeholder="+1 (555) 123-4567"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isUpdatingProfile}
                  className="flex-1 bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    // Reset to original values
                    const phoneNumbers = userInfo.phone_numbers;
                    const phoneNumber = userInfo.phone_number;
                    const mobileNumber = (
                      phoneNumbers 
                        ? (typeof phoneNumbers === 'string' ? phoneNumbers : phoneNumbers[0])
                        : phoneNumber
                    ) || userInfo.pendingPhoneNumberVerified || '';
                    setProfileData({
                      firstName: userInfo.given_name || '',
                      lastName: userInfo.family_name || '',
                      mobileNumber: mobileNumber
                    });
                  }}
                  disabled={isUpdatingProfile}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-[#CF0557]" />
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-semibold text-[#071D49]">
                    {userInfo.given_name ? `${userInfo.given_name}` : 'Not available'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-[#CF0557]" />
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-semibold text-[#071D49]">{userInfo.family_name ? `${userInfo.family_name}` : 'Not available'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-[#CF0557]" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Mobile Number</p>
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
                {isPhoneVerified && (userInfo.phone_numbers || userInfo.phone_number || userInfo.pendingPhoneNumberVerified) && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Verified</span>
                  </div>
                )}
                {!isPhoneVerified && !isEditingProfile && (userInfo.pendingPhoneNumberVerified || userInfo.phone_numbers || userInfo.phone_number) && (
                  <button
                    onClick={handleInitiateVerification}
                    className="text-xs text-[#CF0557] hover:text-[#a00444] font-semibold underline"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      {/* Quotation Selection Section */}
      <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${!isUserDetailsComplete ? 'opacity-60' : ''}`}>
        <h2 className="text-xl font-bold text-[#071D49] mb-4">Select Quotation</h2>
        {!isUserDetailsComplete && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Please complete your user details above before selecting a quotation.
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
                  <p className="text-gray-500 text-xs mt-1">{quotation.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#CF0557]">
                    ${quotation.amount.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    quotation.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {quotation.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form Section */}
      {selectedQuotation && isUserDetailsComplete && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Quotation Summary Card */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-[#CF0557] to-[#FB4D94] rounded-xl shadow-lg p-6 text-white sticky top-24">
              <h3 className="text-lg font-bold mb-4">Quotation Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-pink-100 text-sm">Quotation Number</p>
                  <p className="font-bold text-lg">{selectedQuotationData?.id}</p>
                </div>
                <div>
                  <p className="text-pink-100 text-sm">Service</p>
                  <p className="font-semibold">{selectedQuotationData?.service}</p>
                </div>
                <div>
                  <p className="text-pink-100 text-sm">Date</p>
                  <p className="font-semibold">{selectedQuotationData?.date}</p>
                </div>
                <div className="pt-3 border-t border-pink-300">
                  <p className="text-pink-100 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold">${selectedQuotationData?.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#071D49] mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#CF0557]" />
                Payment Details
              </h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#071D49] mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#071D49] mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentInputChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#071D49] mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#071D49] mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentInputChange}
                      placeholder="123"
                      maxLength={4}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CF0557] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-4 rounded-lg font-bold hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay $${selectedQuotationData?.amount.toFixed(2)}`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  🔒 Your payment information is secure and encrypted
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* No Selection Message */}
      {!selectedQuotation && isUserDetailsComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <CreditCard className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Please select a quotation above to proceed with payment
          </p>
        </div>
      )}
    </div>
  );
};
