import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { CheckCircle, CreditCard, User, Mail, Phone, Edit2, Calendar, Clock } from 'lucide-react';
import { updateMyProfile } from '@/services/scimService';
import { resendMobileVerificationCode } from '@/services/mobileVerificationService';
import { storePaymentRecord } from '@/services/paymentStorage';

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
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(preselectedQuotationId || 'APT-2025-002');
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
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isPaymentDetailsExpanded, setIsPaymentDetailsExpanded] = useState(true); // Start expanded to prompt payment details

  // Check if user just completed payment verification (came back from auth flow)
  useEffect(() => {
    const checkAuthVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasAppointment = urlParams.get('appointment');
      
      // Restore saved payment data from localStorage (for card verification flow)
      const savedPaymentData = localStorage.getItem('pendingPaymentData');
      if (savedPaymentData) {
        try {
          const parsedData = JSON.parse(savedPaymentData);
          setPaymentData(parsedData);
          console.log('✅ Restored payment data from localStorage');
          // Clear the saved data
          localStorage.removeItem('pendingPaymentData');
        } catch (error) {
          console.error('❌ Error parsing saved payment data:', error);
        }
      }
      
      // Restore completed payment data (for post-payment auth flow)
      const completedPaymentData = localStorage.getItem('completedPaymentData');
      if (completedPaymentData) {
        try {
          const parsedData = JSON.parse(completedPaymentData);
          setPaymentData(parsedData);
          console.log('✅ Restored completed payment data from localStorage');
          // Clear the saved data
        //   localStorage.removeItem('completedPaymentData');
        } catch (error) {
          console.error('❌ Error parsing completed payment data:', error);
        }
      }
      
      // Check ACR value in ID token if user is authenticated
      if (authContext.state.isAuthenticated) {
        try {
          // Get the ID token
          const idToken = await authContext.getIDToken();
          
          if (idToken) {
            // Decode the ID token (it's a JWT with 3 parts: header.payload.signature)
            const tokenParts = idToken.split('.');
            if (tokenParts.length === 3) {
              // Decode the payload (second part)
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('🔍 ID Token payload:', payload);
              
              // Check if acr claim exists and equals "payment_verification"
              if (payload.acr === 'payment_verification') {
                console.log('✅ User authenticated with payment_verification ACR - marking as verified');
                setIsAuthVerified(true);
                setIsPaymentDetailsExpanded(false); // Collapse when verified (details already saved)
                
                // Auto-select first appointment when verified
                setAppointmentId('APT-2025-001');
                setSelectedQuotation('Q-2025-001');
                console.log('🎯 Auto-selected first appointment for verified user');
              } else {
                console.log('⚠️ User authenticated but ACR is not payment_verification:', payload.acr);
                setIsAuthVerified(false);
                setIsPaymentDetailsExpanded(true); // Expand when not verified (need to add details)
              }
            }
          }
        } catch (error) {
          console.error('❌ Error checking ID token:', error);
          setIsAuthVerified(false);
          setIsPaymentDetailsExpanded(false);
        }
      }
    };
    
    checkAuthVerification();
  }, [authContext]);

  // Auto-select quotation from URL query parameter and read appointment ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quotationParam = urlParams.get('quotation');
    const appointmentParam = urlParams.get('appointment');
    
    if (quotationParam && !selectedQuotation) {
      console.log('Auto-selecting quotation from URL:', quotationParam);
      setSelectedQuotation(quotationParam);
    }
    
    if (appointmentParam) {
      console.log('Appointment ID from URL:', appointmentParam);
      setAppointmentId(appointmentParam);
    }
  }, [selectedQuotation]);

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
    // },
    // {
    //   id: 'Q-2025-002',
    //   service: 'Regular Cleaning Service',
    //   amount: 89.99,
    //   date: 'Nov 8, 2025',
    //   status: 'pending'
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

  const handleVerifyAuthentication = async () => {
    console.log('🔐 Verifying authentication for payment...');
    
    // Add dummy card details if fields are empty
    const dataToSave = {
      cardNumber: paymentData.cardNumber || '4532 1234 5678 9010',
      cardName: paymentData.cardName || 'John Doe',
      expiryDate: paymentData.expiryDate || '12/26',
      cvv: paymentData.cvv || '123'
    };
    
    // Save to state if it was dummy data
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
      setPaymentData(dataToSave);
      console.log('✨ Added dummy card details for testing');
    }
    
    // Save payment data to localStorage before redirecting
    localStorage.setItem('pendingPaymentData', JSON.stringify(dataToSave));
    console.log('💾 Saved payment data to localStorage');
    
    try {
      // Get current URL with appointment parameter to return after re-authentication
      const currentUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
      console.log('📍 Will redirect back to:', currentUrl);
      
      // Clear session and trigger re-authentication
      Object.keys(window.sessionStorage).forEach((key) => {
        if (key.startsWith('session_data-instance_0-')) {
          window.sessionStorage.removeItem(key);
        }
      });
      
      await authContext.signIn({
        acr_values: "payment_verification",
        prompt: ""
      });
      
    } catch (error) {
      console.error('❌ Authentication verification failed:', error);
    }
  };

  const handleVerificationPromptConfirm = () => {
    setShowVerificationPrompt(false);
    handleVerifyAuthentication();
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Mark as unverified when user changes payment details
    if (isAuthVerified) {
      setIsAuthVerified(false);
      setIsPaymentDetailsExpanded(true); // Expand to show the form
      console.log('🔄 Payment details changed - marking as unverified');
    }
    
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

        // Store payment details in in-memory database if appointment ID exists
        if (appointmentId) {
          const cardLastFour = paymentData.cardNumber.replace(/\s/g, '').slice(-4);
          storePaymentRecord(appointmentId, {
            appointmentId,
            quotationId: paidQuotation.id,
            service: paidQuotation.service,
            amount: paidQuotation.amount,
            cardLastFour,
            cardName: paymentData.cardName,
            customerName: `${userInfo.given_name} ${userInfo.family_name}`,
            customerEmail: userInfo.email || 'customer@example.com',
            paymentDate: new Date().toLocaleDateString()
          });
          console.log(`💾 Payment details stored for appointment ${appointmentId}`);
        }

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
      
      // Don't reset form - keep card details visible
      // setPaymentData({
      //   cardNumber: '',
      //   cardName: '',
      //   expiryDate: '',
      //   cvv: ''
      // });
      // setSelectedQuotation(null);
      
      // Don't call onPaymentComplete here - let user dismiss modal first
      // if (onPaymentComplete) {
      //   onPaymentComplete();
      // }
      
    } catch (error) {
      console.error('Payment error:', error);
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
      {/* Identity Verification Prompt Modal */}
      {showVerificationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <CreditCard className="h-10 w-10 text-[#071D49]" />
              </div>
              <h3 className="text-2xl font-bold text-[#071D49] mb-2">
                Identity Verification Required
              </h3>
              <p className="text-gray-600 mb-6">
                We need to verify your identity before proceeding with payment detail updates. This helps keep your payment information secure.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  🔐 You will be redirected to complete identity verification. Your card details will be saved securely.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleVerificationPromptConfirm}
                  className="w-full bg-gradient-to-r from-[#071D49] to-[#0a2558] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
                >
                  Continue to Verification
                </button>
                
                <button
                  onClick={() => setShowVerificationPrompt(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          Complete your payment details below
        </p>
      </div>

      {/* Payment Details Form - Top Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div 
          className="flex items-center justify-between cursor-pointer mb-6"
          onClick={() => setIsPaymentDetailsExpanded(!isPaymentDetailsExpanded)}
        >
          <h2 className="text-xl font-bold text-[#071D49] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#CF0557]" />
            Payment Details
          </h2>
          <button className="text-[#071D49] hover:text-[#CF0557] transition">
            {isPaymentDetailsExpanded ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
        
        {isPaymentDetailsExpanded && (
          <div className="space-y-4">
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

            {/* Verify Identity Button - Only show when not verified */}
            {!isAuthVerified && (
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-800">
                    🔐 Please verify your identity to save payment card details
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVerificationPrompt(true)}
                  disabled={isAuthVerified}
                  className="w-full bg-[#071D49] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#0a2558] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Card Details
                </button>
              </div>
            )}

            {isAuthVerified && (
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Identity verified - Card details saved securely
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Your payment information is secure and encrypted
            </p>
          </div>
        )}
        
        {!isPaymentDetailsExpanded && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              {isAuthVerified ? (
                <div className="pt-4 border-t border-gray-200">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Identity verified - Card details saved securely
                    </p>
                    </div>
                </div>
              ) : (
                "Click to expand and add payment details"
              )}
            </p>
          </div>
        )}
      </div>

      {/* Appointments List Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-[#071D49] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#CF0557]" />
          Select Appointment to Pay
        </h2>
        
        <div className="space-y-3">
          {[
            {
              id: 'APT-2025-001',
              quotationId: 'Q-2025-001',
              service: 'Deep Cleaning Service',
              amount: 150.00,
              date: 'Nov 15, 2025',
              time: '10:00 AM',
              status: 'pending' as const
            // },
            // {
            //   id: 'APT-2025-002',
            //   quotationId: 'Q-2025-002',
            //   service: 'Regular Cleaning Service',
            //   amount: 89.99,
            //   date: 'Nov 18, 2025',
            //   time: '2:00 PM',
            //   status: 'pending' as const
            }
          ].map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => {
                setSelectedQuotation(appointment.quotationId);
                setAppointmentId(appointment.id);
              }}
              className={`p-4 border-2 rounded-lg transition cursor-pointer ${
                appointmentId === appointment.id
                  ? 'border-[#CF0557] bg-pink-50'
                  : 'border-gray-200 hover:border-[#CF0557] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-[#071D49]">{appointment.id}</span>
                    {appointmentId === appointment.id && (
                      <CheckCircle className="w-5 h-5 text-[#CF0557]" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm font-semibold">{appointment.service}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar className="w-4 h-4" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Quotation: {appointment.quotationId}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#CF0557]">
                    ${appointment.amount.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!appointmentId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              ℹ️ Select an appointment above to proceed with payment
            </p>
          </div>
        )}
      </div>

      {/* Confirm Payment Button - Only show if appointment selected AND card details filled */}
      {selectedQuotation && appointmentId && selectedQuotationData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-[#071D49] mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-gray-600 text-sm">Appointment ID</p>
                <p className="font-bold text-lg text-[#071D49]">{appointmentId}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Quotation Number</p>
                <p className="font-bold text-lg text-[#071D49]">{selectedQuotationData.id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Service</p>
                <p className="font-semibold text-[#071D49]">{selectedQuotationData.service}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Date</p>
                <p className="font-semibold text-[#071D49]">{selectedQuotationData.date}</p>
              </div>
              <div className="pt-3 border-t border-blue-200">
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="text-3xl font-bold text-[#CF0557]">${selectedQuotationData.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Check if card details are filled */}
          {(!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) ? (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 text-center">
              <p className="text-amber-800 font-semibold">
                ⚠️ Please fill in all payment card details above to proceed
              </p>
            </div>
          ) : (
            <button
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-4 rounded-lg font-bold hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </span>
              ) : (
                `Confirm Payment - $${selectedQuotationData.amount.toFixed(2)}`
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
