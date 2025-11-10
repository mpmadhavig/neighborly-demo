import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { User, LogOut, ChevronDown, FileText } from 'lucide-react';

interface UserInfo {
  username?: string;
  email?: string;
  displayName?: string;
}

export const UserProfile: React.FC = () => {
  const { state, signOut, signIn, getBasicUserInfo } = useAuthContext();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [quotationEmail, setQuotationEmail] = useState('');

  useEffect(() => {
    if (state.isAuthenticated) {
      getBasicUserInfo()
        .then((info) => {
          setUserInfo(info);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }
  }, [state.isAuthenticated, getBasicUserInfo]);

  const handleSignOut = () => {
    signOut();
  };

  const handleQuotationsClick = () => {
    setShowEmailPrompt(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quotationEmail) {
      // Trigger sign-in with email as username
      signIn({
        username: quotationEmail
      });
      setShowEmailPrompt(false);
      setQuotationEmail('');
    }
  };

  if (!state.isAuthenticated) {
    return (
      <>
        <button
          onClick={handleQuotationsClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD100] to-[#FFC000] text-[#003087] rounded-lg hover:opacity-90 transition shadow-md font-semibold"
        >
          <FileText size={18} />
          Quotations
        </button>

        {/* Email Prompt Modal */}
        {showEmailPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#003087] to-[#0047AB] p-6 relative">
                <button
                  onClick={() => setShowEmailPrompt(false)}
                  className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">View Your Quotation</h2>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleEmailSubmit} className="p-6">
                <p className="text-gray-700 text-center mb-6">
                  Enter your email address to view your quotation
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-[#003087]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={quotationEmail}
                    onChange={(e) => setQuotationEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD100] focus:border-[#FFD100] outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FFD100] to-[#FFC000] text-[#003087] py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
                  >
                    Continue
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowEmailPrompt(false)}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-[#003087] to-[#0047AB] rounded-full flex items-center justify-center text-white font-bold">
          {userInfo?.username?.charAt(0).toUpperCase() || <User size={20} />}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-[#003087]">
            {userInfo?.username || userInfo?.email || 'User'}
          </p>
          <p className="text-xs text-gray-500">View Profile</p>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <p className="font-semibold text-[#003087]">{userInfo?.username || userInfo?.email}</p>
            {userInfo?.email && userInfo?.username !== userInfo?.email && (
              <p className="text-sm text-gray-500">{userInfo.email}</p>
            )}
          </div>
          
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition text-[#003087]"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
