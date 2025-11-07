import React, { useState, useEffect } from 'react';
import { Phone, Shield, RefreshCw, Edit2 } from 'lucide-react';

interface MobileVerificationPageProps {
  mobileNumber: string;
  onVerificationComplete: () => void;
  onResendCode: () => Promise<boolean>;
  onVerifyCode: (code: string) => Promise<boolean>;
  onCorrectMobileNumber: () => void;
}

export const MobileVerificationPage: React.FC<MobileVerificationPageProps> = ({
  mobileNumber,
  onVerificationComplete,
  onResendCode,
  onVerifyCode,
  onCorrectMobileNumber
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const success = await onVerifyCode(verificationCode);
      
      if (success) {
        console.log('✅ Mobile verification successful');
        onVerificationComplete();
      } else {
        setError('Invalid verification code. Please try again.');
        setVerificationCode('');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsResending(true);

    try {
      const success = await onResendCode();
      
      if (success) {
        console.log('✅ Verification code resent');
        setResendTimer(60);
        setCanResend(false);
        setError('');
      } else {
        setError('Failed to resend code. Please try again.');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#CF0557] to-[#a00444] rounded-full mb-4">
          <Shield className="text-white" size={40} />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Verify Your Mobile Number</h1>
        <p className="text-xl text-gray-600">
          We've sent a verification code to
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <p className="text-xl font-semibold text-[#CF0557]">
            {mobileNumber}
          </p>
          <button
            type="button"
            onClick={onCorrectMobileNumber}
            className="text-sm text-[#071D49] hover:text-[#CF0557] underline flex items-center gap-1 transition"
            title="Change mobile number"
          >
            <Edit2 size={14} />
            Change
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <Phone className="text-blue-600 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-[#071D49] mb-2">Why verify your mobile number?</h3>
            <p className="text-sm text-gray-700 mb-2">
              Mobile verification helps us ensure secure communication and allows us to send you important updates about your booking.
            </p>
            <p className="text-xs text-gray-600 italic">
              Wrong number? Click "Change" above to update your mobile number before verifying.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleVerifyCode}>
        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Verification Code Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">
              Enter Verification Code *
            </label>
            <div className="relative">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                  if (value.length <= 6) {
                    setVerificationCode(value);
                    setError('');
                  }
                }}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none text-center text-2xl font-bold tracking-widest"
                placeholder="••••••"
                maxLength={6}
                required
                autoComplete="off"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Enter the 6-character alphanumeric code sent to your mobile
            </p>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isVerifying || verificationCode.length !== 6}
            className="w-full bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </button>

          {/* Resend Code */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="inline-flex items-center gap-2 text-[#CF0557] hover:text-[#a00444] font-semibold transition disabled:opacity-50"
              >
                <RefreshCw size={18} className={isResending ? 'animate-spin' : ''} />
                {isResending ? 'Resending...' : 'Resend Code'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend code in <span className="font-semibold text-[#CF0557]">{resendTimer}s</span>
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Having trouble? Make sure you entered the correct mobile number during registration.
        </p>
      </div>
    </div>
  );
};
