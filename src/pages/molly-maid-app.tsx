import React, { useState } from 'react';
import { Header } from '../components/molly-maid/Header';
import { Navigation } from '../components/molly-maid/Navigation';
import { Footer } from '../components/molly-maid/Footer';
import { HomePage } from '../components/molly-maid/HomePage';
import { ServicesPage } from '../components/molly-maid/ServicesPage';
import { BookingPage } from '../components/molly-maid/BookingPage';
import { BlogPage } from '../components/molly-maid/BlogPage';
import { GiftsPage } from '../components/molly-maid/GiftsPage';
import { useAsgardeoApi } from '@/hooks/useAsgardeoApi';

export default function MollyMaidApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    zipCode: ''
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpFlowData, setOtpFlowData] = useState<{ flowId: string; actionId: string } | null>(null);
  
  const { initiateRegistrationFlow, submitRegistrationForm, verifyOtp, completeAuthentication, initiateOAuthFlow } = useAsgardeoApi();

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
      // Step 1: Initiate OAuth flow to get the OAuth flowId
      console.log('Initiate OAuth flow to get the OAuth flowId...');
      const oauthFlowId = await initiateOAuthFlow();
      console.log('OAuth flow ID:', oauthFlowId);

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
        
        console.log('Registration complete. Initiating OAuth flow...');
        const userAssertion = result.data.additionalData.userAssertion;
        
        // Step 3: Complete authentication with commonauth endpoint using OAuth flowId
        console.log('Completing authentication...');
        const authResponse = await completeAuthentication(oauthFlowId, userAssertion);
        console.log('Authentication completed:', authResponse);

        // Reset all form data
        setFormData({
          email: '',
          address: '',
          zipCode: ''
        });
        setOtp('');
        setShowOtpInput(false);
        setOtpFlowData(null);

        alert('Registration and authentication completed successfully!');
      } else {
        console.warn('Unexpected flow status:', result.flowStatus);
      }

    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <HomePage setActiveTab={setActiveTab} setSelectedService={setSelectedService} />}
        {activeTab === 'services' && <ServicesPage setActiveTab={setActiveTab} setSelectedService={setSelectedService} />}
        {activeTab === 'booking' && (
          <BookingPage 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleSubmit}
            showOtpInput={showOtpInput}
            otp={otp}
            setOtp={setOtp}
            handleOtpSubmit={handleOtpSubmit}
          />
        )}
        {activeTab === 'blog' && <BlogPage />}
        {activeTab === 'gifts' && <GiftsPage setActiveTab={setActiveTab} />}
      </main>

      <Footer />
    </div>
  );
}
