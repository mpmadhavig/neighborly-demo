import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/molly-maid/Header';
import { Navigation } from '../components/molly-maid/Navigation';
import { Footer } from '../components/molly-maid/Footer';
import { HomePage } from '../components/molly-maid/HomePage';
import { ServicesPage } from '../components/molly-maid/ServicesPage';
import { BookingPage } from '../components/molly-maid/BookingPage';
import { BlogPage } from '../components/molly-maid/BlogPage';
import { GiftsPage } from '../components/molly-maid/GiftsPage';
import { DashboardPage } from '../components/molly-maid/DashboardPage';
import { PaymentPage } from '../components/molly-maid/PaymentPage';
import { ProfileAndPaymentPage } from '../components/molly-maid/ProfileAndPaymentPage';
import { MobileVerificationPage } from '../components/molly-maid/MobileVerificationPage';
import { useAsgardeoApi } from '@/hooks/useAsgardeoApi';
import { sendRegistrationEmail } from '@/services/emailService';
import { updateMyProfile } from '@/services/scimService';
import { validateMobileVerificationCode, resendMobileVerificationCode } from '@/services/mobileVerificationService';

export default function MollyMaidApp() {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL
  const getActiveTabFromPath = () => {
    const path = location.pathname.slice(1); // Remove leading slash
    return path || 'home';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    zipCode: ''
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpFlowData, setOtpFlowData] = useState<{ flowId: string; actionId: string } | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showMobileVerification, setShowMobileVerification] = useState(false);
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [isProfileFromToken, setIsProfileFromToken] = useState(false);
  const [registeredUserEmail, setRegisteredUserEmail] = useState<string>(''); // Store email for profile update
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Track previous authentication state to detect sign-in events
  const prevAuthStateRef = useRef(authContext.state.isAuthenticated);
  
  const { initiateRegistrationFlow, submitRegistrationForm, verifyOtp, completeAuthentication, initiateOAuthFlow } = useAsgardeoApi();

  // Sync activeTab with URL changes
  useEffect(() => {
    const path = location.pathname.slice(1);
    const newTab = path || 'home';
    
    // Block dashboard access if not authenticated and show modal
    if (newTab === 'dashboard' && !authContext.state.isAuthenticated) {
      console.log('Dashboard access blocked - showing sign-in modal');
      setShowSignInModal(true);
      navigate('/home');
      setActiveTab('home');
      return;
    }
    
    setActiveTab(newTab);
  }, [location.pathname, authContext.state.isAuthenticated, navigate]);

  // Navigate when activeTab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab === 'home' ? '' : tab}`);
  };

  // Check for active session on mount and perform silent sign-in
  useEffect(() => {
    const checkSession = async () => {
      if (!authContext.state.isAuthenticated && !authContext.state.isLoading) {
        try {
          // Try to get access token silently
          const isSignedIn = await authContext.trySignInSilently();
          if (isSignedIn) {
            console.log('Silent sign-in successful');
          }
        } catch (error) {
          // Silent sign-in failed, user needs to sign in manually
          console.log('No active session found');
        }
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Redirect to dashboard only when user first signs in (not on page reload or tab changes)
  useEffect(() => {
    const wasAuthenticated = prevAuthStateRef.current;
    const isAuthenticated = authContext.state.isAuthenticated;
    
    // Only redirect if user just signed in (transition from false to true)
    if (!wasAuthenticated && isAuthenticated) {
      setActiveTab('dashboard');
      navigate('/dashboard');
    }
    
    // Update ref for next render
    prevAuthStateRef.current = isAuthenticated;
  }, [authContext.state.isAuthenticated, navigate]);

  // Pre-fill profile data from ID token or userinfo endpoint when profile form is shown
  useEffect(() => {
    const loadProfileData = async () => {
      if (showProfileForm && authContext.state.isAuthenticated) {
        try {
          // Try ID token first
          let userInfo = await authContext.getBasicUserInfo();
          console.log('User info from ID token:', userInfo);
          
          // If no data in ID token, try userinfo endpoint
          if (!userInfo?.given_name || !userInfo?.family_name || !userInfo?.phone_number) {
            try {
              const accessToken = await authContext.getAccessToken();
              const response = await fetch(`https://api.asgardeo.io/t/vihanga3/oauth2/userinfo`, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              });
              if (response.ok) {
                const userinfoData = await response.json();
                console.log('User info from userinfo endpoint:', userinfoData);
                userInfo = { ...userInfo, ...userinfoData };
              }
            } catch (error) {
              console.warn('Failed to fetch from userinfo endpoint:', error);
            }
          }
          
          // Pre-fill profile data if available
          if (userInfo) {
            const hasProfileData = userInfo.given_name || userInfo.family_name || userInfo.phone_number;
            setIsProfileFromToken(!!hasProfileData);
            
            setProfileData(prev => ({
              firstName: userInfo.given_name || prev.firstName,
              lastName: userInfo.family_name || prev.lastName,
              mobileNumber: userInfo.phone_number || prev.mobileNumber,
            }));
          }
        } catch (error) {
          console.error('Error loading user info:', error);
        }
      }
    };

    loadProfileData();
  }, [showProfileForm, authContext]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Initiate registration flow
      console.log('Initiating registration flow...');
      const flowResponse = await initiateRegistrationFlow();
      console.log('Registration flow initiated:', flowResponse);

      // Step 2: Submit registration form with the flow response
      console.log('Submitting registration form...');
      const result = await submitRegistrationForm(flowResponse, formData);
      console.log('Registration submitted successfully:', result);

      // Step 3: Check if OTP verification is required
      if (result.flowStatus === 'INCOMPLETE' && result.type === 'VIEW') {
        // Extract button actionId from OTP verification response
        interface Component {
          type: string;
          variant?: string;
          actionId?: string;
          components?: Component[];
        }
        
        const formComponent = result.data.components.find((comp: Component) => comp.type === 'FORM');
        const button = formComponent?.components?.find((comp: Component) => comp.type === 'BUTTON' && comp.variant === 'PRIMARY');
        
        if (button && button.actionId) {
          setOtpFlowData({
            flowId: result.flowId,
            actionId: button.actionId
          });
          setShowOtpInput(true);
          return;
        }
      }

      // If no OTP required, reset form
      setFormData({
        email: '',
        address: '',
        zipCode: ''
      });
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpFlowData) {
      return;
    }

    try {
      // // Step 1: Initiate OAuth flow to get the OAuth flowId
      // console.log('Initiate OAuth flow to get the OAuth flowId...');
      // const oauthFlowId = await initiateOAuthFlow();
      // console.log('OAuth flow ID:', oauthFlowId);

      // Step 2: Verify OTP
      console.log('Verifying OTP...');
      const result = await verifyOtp(otpFlowData.flowId, otpFlowData.actionId, otp);
      console.log('OTP verification result:', result);

      // Check if OTP verification is still incomplete (invalid OTP)
      if (result.flowStatus === 'INCOMPLETE') {
        alert('Invalid OTP. Please try again.');
        setOtp(''); // Clear the OTP input to allow retry
        return;
      }

      // Check if registration is complete
      if (result.flowStatus === 'COMPLETE' && result.data?.additionalData?.userAssertion) {
        
        console.log('Registration complete!');
        // const userAssertion = result.data.additionalData.userAssertion;
        
        // // Step 3: Complete authentication with commonauth endpoint using OAuth flowId
        // console.log('Completing authentication...');
        // const authResponse = await completeAuthentication(oauthFlowId, userAssertion);
        // console.log('Authentication completed:', authResponse);

        // Send registration email
        console.log('Sending registration email...');
        const emailResult = await sendRegistrationEmail(
          formData.email,
          formData.address,
          formData.zipCode
        );
        
        if (emailResult.success) {
          console.log('✅ Registration email sent successfully');
        } else {
          console.warn('⚠️ Failed to send registration email:', emailResult.error);
          // Don't block the registration flow if email fails
        }

        // Store email before resetting form data
        setRegisteredUserEmail(formData.email);

        // Reset form data and show success banner
        setFormData({
          email: '',
          address: '',
          zipCode: ''
        });
        setOtp('');
        setShowOtpInput(false);
        setOtpFlowData(null);
        setShowSuccessBanner(true);

        // alert('Registration and authentication completed successfully!');
      } else {
        console.warn('Unexpected flow status:', result.flowStatus);
      }

    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSignIn = () => {
    authContext.signIn();
  };

  const handleAcceptQuotation = () => {
    // Hide success banner and show profile form
    setShowSuccessBanner(false);
    setShowProfileForm(true);
  };

  const handleAcceptQuotationFromDashboard = () => {
    // Navigate to booking tab and show profile form
    setActiveTab('booking');
    navigate('/booking');
    setShowProfileForm(true);
    setShowPaymentPage(false);
    setShowSuccessBanner(false);
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      console.log('Submitting profile data:', profileData);

      // Check if user is authenticated
      const isAuthenticated = authContext.state.isAuthenticated;
      console.log('Is authenticated:', isAuthenticated);
      
      if (isAuthenticated) {
        // Update profile using /Me endpoint (works from browser!)
        console.log('User is authenticated - updating profile via SCIM /Me endpoint');
        
        const accessToken = await authContext.getAccessToken();
        
        if (!accessToken) {
          console.warn('No access token available, skipping profile update');
          // Continue to mobile verification
          setProfileSubmitted(true);
          setShowMobileVerification(true);
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
          console.info('💡 Profile data has been collected and will be available in the application context');
          // Continue to mobile verification anyway
        } else {
          console.log('✅ Profile updated successfully in Asgardeo!');
          console.log('📱 Mobile verification code should be sent automatically by Asgardeo');
        }
        
        // Show mobile verification step
        setProfileSubmitted(true);
        setShowMobileVerification(true);
      } else {
        // User is not authenticated (coming from registration flow)
        console.log('User not authenticated - profile data collected for later use');
        console.info('💡 Profile will be available after sign-in via login_hint=payment');
        // Skip mobile verification for non-authenticated users
        setProfileSubmitted(true);
      }

    } catch (error) {
      console.error('Error in profile submission:', error);
      // Don't show error to user, just log and continue
      console.warn('Continuing to mobile verification despite error');
      setProfileSubmitted(true);
      setShowMobileVerification(true);
    } finally {
      setIsUpdatingProfile(false);
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
    
    // For CVV and card name
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleVerifyMobileCode = async (code: string): Promise<boolean> => {
    try {
      const accessToken = await authContext.getAccessToken();
      
      if (!accessToken) {
        console.error('No access token available for mobile verification');
        return false;
      }

      const result = await validateMobileVerificationCode(code, accessToken);
      
      if (result.success) {
        console.log('✅ Mobile number verified successfully');
        return true;
      } else {
        console.warn('Mobile verification failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error verifying mobile code:', error);
      return false;
    }
  };

  const handleResendMobileCode = async (): Promise<boolean> => {
    try {
      const accessToken = await authContext.getAccessToken();
      
      if (!accessToken) {
        console.error('No access token available for resending code');
        return false;
      }

      const result = await resendMobileVerificationCode(accessToken);
      
      if (result.success) {
        console.log('✅ Verification code resent successfully');
        return true;
      } else {
        console.warn('Failed to resend code:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error resending mobile code:', error);
      return false;
    }
  };

  const handleMobileVerificationComplete = () => {
    console.log('Mobile verification complete, showing payment section');
    setShowMobileVerification(false);
    // Mobile verification done, payment section will show because profileSubmitted is true
  };

  const handleCorrectMobileNumber = () => {
    console.log('User wants to correct mobile number, going back to profile form');
    setShowMobileVerification(false);
    setProfileSubmitted(false);
    setIsProfileFromToken(false); // Make fields editable
    // This will show the profile form again with current data, allowing user to edit
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Processing payment...', paymentData);
      
      // Here you would normally process the payment with a payment gateway
      // For now, we'll simulate a successful payment
      
      // After successful payment, trigger sign-in with login_hint=payment
      console.log('Payment successful! Initiating sign-in with login_hint=payment and forcing re-authentication');
      
      // Sign in with login_hint parameter and force login
      authContext.signIn({
        login_hint: 'payment',
        prompt: 'login'
      });
      
      // Reset payment data
      setPaymentData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleSignInFromModal = () => {
    setShowSignInModal(false);
    authContext.signIn();
  };

  const handleCloseModal = () => {
    setShowSignInModal(false);
  };

  // Show loading state while authentication is being processed
  if (authContext.state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#CF0557]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sign-in Required Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#071D49] to-[#0a2d6b] p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Sign In Required</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 text-center mb-6">
                You need to sign in to access your dashboard and view your quotations, bookings, and account details.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleSignInFromModal}
                  className="w-full bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
                >
                  Sign In Now
                </button>
                
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Maybe Later
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setShowSignInModal(false);
                      handleTabChange('booking');
                    }}
                    className="text-[#CF0557] font-semibold hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header />
      <Navigation activeTab={activeTab} setActiveTab={handleTabChange} isAuthenticated={authContext.state.isAuthenticated} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <HomePage setActiveTab={handleTabChange} setSelectedService={setSelectedService} />}
        {activeTab === 'services' && <ServicesPage setActiveTab={handleTabChange} setSelectedService={setSelectedService} />}
        {activeTab === 'booking' && !showProfileForm && !showPaymentPage && (
          <BookingPage
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            showOtpInput={showOtpInput}
            otp={otp}
            setOtp={setOtp}
            handleOtpSubmit={handleOtpSubmit}
            showSuccessBanner={showSuccessBanner}
            handleSignIn={handleSignIn}
            handleAcceptQuotation={handleAcceptQuotation}
          />
        )}
        {activeTab === 'booking' && showProfileForm && !showMobileVerification && (
          <ProfileAndPaymentPage
            profileData={profileData}
            paymentData={paymentData}
            handleProfileInputChange={handleProfileInputChange}
            handlePaymentInputChange={handlePaymentInputChange}
            handleProfileSubmit={handleProfileSubmit}
            handlePaymentSubmit={handlePaymentSubmit}
            isLoading={isUpdatingProfile}
            isProfileFromToken={isProfileFromToken}
            quotationAmount={150.00}
            profileSubmitted={profileSubmitted}
            showPayment={!showMobileVerification}
          />
        )}
        {activeTab === 'booking' && showMobileVerification && (
          <MobileVerificationPage
            mobileNumber={profileData.mobileNumber}
            onVerificationComplete={handleMobileVerificationComplete}
            onResendCode={handleResendMobileCode}
            onVerifyCode={handleVerifyMobileCode}
            onCorrectMobileNumber={handleCorrectMobileNumber}
          />
        )}
        {activeTab === 'blog' && <BlogPage />}
        {activeTab === 'dashboard' && authContext.state.isAuthenticated && (
          <DashboardPage onAcceptQuotation={handleAcceptQuotationFromDashboard} />
        )}
        {activeTab === 'gifts' && <GiftsPage setActiveTab={handleTabChange} />}
      </main>

      <Footer />
    </div>
  );
}
