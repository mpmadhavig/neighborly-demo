import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/molly-maid/Header';
import { Navigation } from '../components/molly-maid/Navigation';
import { Footer } from '../components/molly-maid/Footer';
import { HomePage } from '../components/molly-maid/HomePage';
import { ServicesPage } from '../components/molly-maid/ServicesPage';
import { BookingPage } from '../components/molly-maid/BookingPage';
import { DashboardPage } from '../components/molly-maid/DashboardPage';
import { ProfileAndPaymentPage } from '../components/molly-maid/ProfileAndPaymentPage';
import { MobileVerificationPage } from '../components/molly-maid/MobileVerificationPage';
import { PaymentsTab } from '../components/molly-maid/PaymentsTab';
import { AppointmentsTab } from '../components/molly-maid/AppointmentsTab';
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
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
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
  const [showQuotationVerifyModal, setShowQuotationVerifyModal] = useState(false);
  const [quotationEmail, setQuotationEmail] = useState<string>('');
  const [showRegistrationErrorModal, setShowRegistrationErrorModal] = useState(false);
  const [showAcceptQuotationModal, setShowAcceptQuotationModal] = useState(false);
  const [acceptQuotationEmail, setAcceptQuotationEmail] = useState<string>('');
  const [selectedQuotationForPayment, setSelectedQuotationForPayment] = useState<string | null>(null);
  const [intendedDestination, setIntendedDestination] = useState<string | null>(null);
  
  // Track previous authentication state to detect sign-in events
  const prevAuthStateRef = useRef(authContext.state.isAuthenticated);
  
  const { initiateRegistrationFlow, submitRegistrationForm, verifyOtp, completeAuthentication, initiateOAuthFlow } = useAsgardeoApi();

    // Sync activeTab with URL changes
  useEffect(() => {
    const path = location.pathname.slice(1);
    const newTab = path || 'home';
    
    console.log('🔍 URL Sync - Path:', location.pathname, 'Tab:', newTab, 'Authenticated:', authContext.state.isAuthenticated, 'Loading:', authContext.state.isLoading);
    
    // Don't block access if authentication is still loading (checking for active token)
    if (authContext.state.isLoading) {
      console.log('⏳ Authentication still loading, waiting...');
      return;
    }
    
    // Check if this is an OAuth callback (has code/state params)
    const urlParams = new URLSearchParams(location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('session_state');
    
    if (hasOAuthParams && !authContext.state.isAuthenticated) {
      console.log('🔄 OAuth callback detected, waiting for token exchange...');
      return; // Don't redirect during OAuth callback processing
    }
    
    // Block quotations access if not authenticated and show modal
    if (newTab === 'quotations' && !authContext.state.isAuthenticated) {
      console.log('🚫 Quotations access blocked - showing sign-in modal');
      setIntendedDestination(location.pathname + location.search);
      setShowSignInModal(true);
      navigate('/home');
      setActiveTab('home');
      return;
    }
    
    // Block payments access if not authenticated and show modal
    if (newTab === 'payments' && !authContext.state.isAuthenticated) {
      console.log('🚫 Payments access blocked - showing sign-in modal');
      console.log('💾 Saving intended destination:', location.pathname + location.search);
      setIntendedDestination(location.pathname + location.search);
      setShowSignInModal(true);
      navigate('/home');
      setActiveTab('home');
      return;
    }
    
    // Block appointments access if not authenticated and show modal
    if (newTab === 'appointments' && !authContext.state.isAuthenticated) {
      console.log('🚫 Appointments access blocked - showing sign-in modal');
      setIntendedDestination(location.pathname + location.search);
      setShowSignInModal(true);
      navigate('/home');
      setActiveTab('home');
      return;
    }
    
    console.log('✅ Setting active tab to:', newTab);
    setActiveTab(newTab);
  }, [location.pathname, location.search, authContext.state.isAuthenticated, authContext.state.isLoading, navigate]);

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
          } else {
            console.log('Silent sign-in failed');
          }
        } catch (error) {
          // Silent sign-in failed, user needs to sign in manually
          console.log('No active session found');
        }
      }
    };

    checkSession();
  }, []);

  // Handle quotation URL with email parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    
    if (emailParam && activeTab === 'quotation' && !authContext.state.isAuthenticated) {
      setQuotationEmail(emailParam);
      setShowQuotationVerifyModal(true);
    }
  }, [location.search, activeTab, authContext.state.isAuthenticated]);

  // Handle user query parameter for direct login
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userParam = searchParams.get('user');
    
    if (userParam && !authContext.state.isAuthenticated) {
      console.log('User parameter detected:', userParam);
      setAcceptQuotationEmail(userParam);
      setShowAcceptQuotationModal(true);
    }
  }, [location.search, authContext.state.isAuthenticated, authContext]);

  // Redirect to intended destination or quotations when user first signs in
  useEffect(() => {
    const wasAuthenticated = prevAuthStateRef.current;
    const isAuthenticated = authContext.state.isAuthenticated;
    
    // Only redirect if user just signed in (transition from false to true)
    if (!wasAuthenticated && isAuthenticated) {
      // Check ID token for payment_verification ACR
      const checkAcrAndRedirect = async () => {
        try {
          const idToken = await authContext.getIDToken();
          if (idToken) {
            const tokenParts = idToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              
              // If ACR is payment_verification, redirect to payments
              if (payload.acr === 'payment_verification') {
                console.log('🔄 ACR is payment_verification - redirecting to payments');
                setActiveTab('payments');
                navigate('/payments');
                return;
              }
            }
          }
        } catch (error) {
          console.error('Error checking ACR:', error);
        }
        
        // Continue with normal redirect logic
        const currentPath = location.pathname.slice(1);
        const isOnProtectedPage = ['payments', 'appointments', 'quotations'].includes(currentPath);
        
        if (isOnProtectedPage) {
          // User is already on the right page (came from OAuth redirect), don't redirect
          console.log('✅ User authenticated and already on protected page:', currentPath);
        } else if (intendedDestination) {
          // Redirect to the page they were trying to access
          console.log('🔄 Redirecting to intended destination:', intendedDestination);
          const path = intendedDestination.split('?')[0].slice(1); // Remove leading slash and query params
          const tab = path || 'home';
          setActiveTab(tab);
          navigate(intendedDestination);
          setIntendedDestination(null); // Clear after use
        } else {
          // Default redirect to quotations
          console.log('🔄 Redirecting to default quotations page');
          setActiveTab('quotations');
          navigate('/quotations');
        }
      };
      
      checkAcrAndRedirect();
    }
    
    // Update ref for next render
    prevAuthStateRef.current = isAuthenticated;
  }, [authContext, intendedDestination, location.pathname, navigate]);

  // Auto-close sign-in modal if user becomes authenticated (has active token)
  useEffect(() => {
    if (authContext.state.isAuthenticated && showSignInModal) {
      console.log('User authenticated - closing sign-in modal');
      setShowSignInModal(false);
    }
  }, [authContext.state.isAuthenticated, showSignInModal]);

  // Pre-fill profile data from ID token or userinfo endpoint when profile form is shown
  useEffect(() => {
    const loadProfileData = async () => {
      if (showProfileForm && authContext.state.isAuthenticated) {
        try {
          // Try ID token first
          let userInfo = await authContext.getBasicUserInfo();
          console.log('User info from ID token:', userInfo);
          
          // If no data in ID token, try userinfo endpoint
          if (!userInfo?.given_name || !userInfo?.family_name || !userInfo?.phone_number || !userInfo?.pendingPhoneNumberVerified) {
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
          
          // Check phone verification status
          // If phone_number exists in response, phone is VERIFIED
          // If phone_number doesn't exist but pendingPhoneNumberVerified exists, phone is NOT verified
          const phoneVerified = !!userInfo?.phone_number;
          setIsPhoneVerified(phoneVerified);
          console.log('Phone number verified status:', phoneVerified);
          console.log('phone_number value:', userInfo?.phone_number);
          console.log('pendingPhoneNumberVerified value:', userInfo?.pendingPhoneNumberVerified);
          
          // Get mobile number from phone_number if verified, otherwise from pendingPhoneNumberVerified
          const mobileNumber = userInfo?.phone_number || userInfo?.pendingPhoneNumberVerified || '';
          
          // Pre-fill profile data if available
          if (userInfo) {
            const hasProfileData = userInfo.given_name || userInfo.family_name || mobileNumber;
            setIsProfileFromToken(!!hasProfileData);
            
            setProfileData(prev => ({
              firstName: userInfo.given_name || prev.firstName,
              lastName: userInfo.family_name || prev.lastName,
              mobileNumber: mobileNumber || prev.mobileNumber,
            }));

            // If phone is already verified and we have complete profile data, auto-submit
            if (phoneVerified && userInfo.given_name && userInfo.family_name && userInfo.phone_number) {
              console.log('📱 Phone verified and profile complete - auto-submitting to show payment section');
              setProfileSubmitted(true);
            }
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
        // Extract button actionId and OTP field identifier from OTP verification response
        interface Component {
          type: string;
          variant?: string;
          actionId?: string;
          id?: string;
          components?: Component[];
          config?: {
            identifier?: string;
          };
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

    } catch (error: unknown) {
      console.error('Error verifying OTP:', error);
      
      // Check if it's a 400 error (likely existing user or invalid data)
      const err = error as { response?: { status?: number; data?: { code?: string } } };
      if (err?.response?.status === 400 || err?.response?.data?.code === '400') {
        // Show error modal for 400 errors
        setShowRegistrationErrorModal(true);
      } else {
        // For other errors, show generic alert
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleSignIn = () => {
    authContext.signIn({
        login_hint: "payment",
        prompt: "none"
      });
  };

  const handleAcceptQuotation = () => {
    // Hide success banner and show profile form
    setShowSuccessBanner(false);
    setShowProfileForm(true);
  };

  const handleAcceptQuotationFromDashboard = () => {
    // Navigate to appointments tab to schedule appointment
    navigate('/appointments');
    setActiveTab('appointments');
  };

  const handleRegistrationErrorRestart = () => {
    // Close the error modal
    setShowRegistrationErrorModal(false);
    
    // Reset all registration-related state
    setFormData({
      email: '',
      address: '',
      zipCode: ''
    });
    setOtp('');
    setShowOtpInput(false);
    setOtpFlowData(null);
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
          // Continue to payment (skip mobile verification)
          setProfileSubmitted(true);
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
          
          // Check if phone is already verified
          if (isPhoneVerified) {
            console.log('📱 Phone number is already verified, proceeding to payment');
            setProfileSubmitted(true);
            return;
          } else {
            // Even if update failed, show mobile verification if phone is not verified
            console.log('📱 Phone number not verified, showing mobile verification despite update failure');
            setProfileSubmitted(true);
            setShowMobileVerification(true);
            return;
          }
        } else {
          console.log('✅ Profile updated successfully in Asgardeo!');
        }
        
        // Check if phone is already verified
        if (isPhoneVerified) {
          console.log('📱 Phone number is already verified, skipping mobile verification step');
          setProfileSubmitted(true);
          // Skip mobile verification, go directly to payment
        } else {
          console.log('📱 Phone number not verified, prompting for mobile verification');
          console.log('📱 Mobile verification code should be sent automatically by Asgardeo');
          // Show mobile verification step
          setProfileSubmitted(true);
          setShowMobileVerification(true);
        }
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
      console.warn('Continuing to payment despite error');
      setProfileSubmitted(true);
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

  const handleMobileVerificationComplete = async () => {
    console.log('Mobile verification complete, refreshing user info...');
    
    try {
      // Refresh user info from userinfo endpoint to get updated phone_number
      const accessToken = await authContext.getAccessToken();
      if (accessToken) {
        const response = await fetch(`https://api.asgardeo.io/t/vihanga3/oauth2/userinfo`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.ok) {
          const userInfo = await response.json();
          console.log('✅ User info refreshed after verification:', userInfo);
          
          // Check phone verification status - should be verified now
          // If phone_number exists in response, phone is VERIFIED
          const phoneVerified = !!userInfo?.phone_number;
          setIsPhoneVerified(phoneVerified);
          console.log('Updated phone verification status:', phoneVerified);
          console.log('Updated phone_number value:', userInfo?.phone_number);
          console.log('Updated pendingPhoneNumberVerified value:', userInfo?.pendingPhoneNumberVerified);
          
          // Get mobile number from phone_number if verified, otherwise from pendingPhoneNumberVerified
          const mobileNumber = userInfo?.phone_number || userInfo?.pendingPhoneNumberVerified || '';
          console.log('Updated mobile number:', mobileNumber);
          
          // Update profile data with verified mobile number
          setProfileData(prev => ({
            ...prev,
            firstName: userInfo.given_name || prev.firstName,
            lastName: userInfo.family_name || prev.lastName,
            mobileNumber: mobileNumber || prev.mobileNumber,
          }));
        } else {
          console.warn('Failed to refresh user info after verification');
        }
      }
    } catch (error) {
      console.error('Error refreshing user info after verification:', error);
    }
    
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

  const handleEditMobileNumber = () => {
    console.log('User wants to edit mobile number from payment section');
    setProfileSubmitted(false);
    setIsProfileFromToken(false); // Make fields editable
    setIsPhoneVerified(false); // Reset verification status
    // This will show the profile form again with current data, allowing user to edit mobile number
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
        login_hint: "payment",
        prompt: "none"
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
    
    // If there's an intended destination, use it as the redirect URL
    if (intendedDestination) {
      const fullUrl = `${window.location.origin}${intendedDestination}`;
      console.log('🔐 Signing in with redirect to:', fullUrl);
      authContext.signIn({
        signInRedirectURL: fullUrl
      });
    } else {
      authContext.signIn();
    }
  };

  const handleCloseModal = () => {
    setShowSignInModal(false);
  };

  const handleVerifyEmailForQuotation = () => {
    // User clicked "Yes" to verify email
    setShowQuotationVerifyModal(false);
    // Sign in with the email from the quotation link
    authContext.signIn({
      username: quotationEmail
    });
  };

  const handleCancelQuotationVerify = () => {
    // User clicked "No" to stay logged out
    setShowQuotationVerifyModal(false);
    setQuotationEmail('');
    // Navigate to home
    navigate('/');
    setActiveTab('home');
  };

  const handleAcceptQuotationVerify = () => {
    // User clicked "Yes" to verify and accept quotation
    setShowAcceptQuotationModal(false);
    // Sign in with the email from the accept quotation link
    authContext.signIn({
      username: acceptQuotationEmail
    });
  };

  const handleCancelAcceptQuotation = () => {
    // User clicked "Cancel"
    setShowAcceptQuotationModal(false);
    setAcceptQuotationEmail('');
    // Navigate to home
    navigate('/');
    setActiveTab('home');
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
      {/* Quotation Email Verification Modal */}
      {showQuotationVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#CF0557] to-[#FB4D94] p-6 relative">
              <button
                onClick={handleCancelQuotationVerify}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 text-center mb-2">
                To view your quotation, please verify your email address:
              </p>
              <p className="text-[#CF0557] font-semibold text-center mb-6 text-lg">
                {quotationEmail}
              </p>
              <p className="text-gray-600 text-sm text-center mb-6">
                We'll send you a verification code to confirm your identity and ensure secure access to your quotation.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleVerifyEmailForQuotation}
                  className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
                >
                  Yes, Verify Email
                </button>
                
                <button
                  onClick={handleCancelQuotationVerify}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  No, Stay Logged Out
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  By verifying your email, you'll be able to view your quotation details and proceed with booking if you choose.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Error Modal */}
      {showRegistrationErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 relative">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Registration Error</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 text-center mb-4">
                We encountered an issue completing your registration.
              </p>
              <p className="text-gray-700 text-center mb-6 font-semibold">
                Please check your details and try again.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleRegistrationErrorRestart}
                  className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
                >
                  Start Over
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  If you already have an account, try signing in instead of registering.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accept Quotation Verification Modal */}
      {showAcceptQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#CF0557] to-[#FB4D94] p-6 relative">
              <button
                onClick={handleCancelAcceptQuotation}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Accept Your Quotation</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 text-center mb-2">
                We're redirecting you to verify your email address:
              </p>
              <p className="text-[#CF0557] font-semibold text-center mb-6 text-lg">
                {acceptQuotationEmail}
              </p>
              <p className="text-gray-600 text-sm text-center mb-6">
                To accept your quotation and proceed with booking, we need to verify your identity.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleAcceptQuotationVerify}
                  className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
                >
                  Continue
                </button>
                
                <button
                  onClick={handleCancelAcceptQuotation}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  By verifying your email, you'll be able to accept the quotation and complete your booking.
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
        {(activeTab === 'booking' || activeTab === 'payments') && showProfileForm && !showMobileVerification && (
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
            onEditMobileNumber={handleEditMobileNumber}
          />
        )}
        {(activeTab === 'booking' || activeTab === 'payments') && showMobileVerification && (
          <MobileVerificationPage
            mobileNumber={profileData.mobileNumber}
            onVerificationComplete={handleMobileVerificationComplete}
            onResendCode={handleResendMobileCode}
            onVerifyCode={handleVerifyMobileCode}
            onCorrectMobileNumber={handleCorrectMobileNumber}
          />
        )}
        {activeTab === 'quotations' && authContext.state.isAuthenticated && (
          <DashboardPage 
            onAcceptQuotation={handleAcceptQuotationFromDashboard}
            onNavigateToPayments={handleAcceptQuotationFromDashboard}
          />
        )}
        {activeTab === 'payments' && authContext.state.isAuthenticated && !showProfileForm && !showMobileVerification && (
          <PaymentsTab 
            preselectedQuotationId={selectedQuotationForPayment}
            onPaymentComplete={() => {
              setSelectedQuotationForPayment(null);
              setActiveTab('quotations');
              navigate('/quotations');
            }}
            onShowMobileVerification={() => {
              setShowMobileVerification(true);
            }}
          />
        )}
        {activeTab === 'appointments' && authContext.state.isAuthenticated && (
          <AppointmentsTab />
        )}
        {/* {activeTab === 'appointments' && !authContext.state.isAuthenticated && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Please sign in to view appointments
          </div>
        )} */}
      </main>

      <Footer />
    </div>
  );

  
          
}
