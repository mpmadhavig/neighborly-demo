import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { User, LogOut, ChevronDown, LogIn } from 'lucide-react';

interface UserInfo {
  username?: string;
  email?: string;
  displayName?: string;
}

export const UserProfile: React.FC = () => {
  const { state, signOut, signIn, getBasicUserInfo } = useAuthContext();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleSignIn = () => {
    signIn();
  };

  if (!state.isAuthenticated) {
    return (
      <button
        onClick={handleSignIn}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white rounded-lg hover:opacity-90 transition shadow-md font-semibold"
      >
        <LogIn size={18} />
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-[#CF0557] to-[#FB4D94] rounded-full flex items-center justify-center text-white font-bold">
          {userInfo?.username?.charAt(0).toUpperCase() || <User size={20} />}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-[#071D49]">
            {userInfo?.username || userInfo?.email || 'User'}
          </p>
          <p className="text-xs text-gray-500">View Profile</p>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <p className="font-semibold text-[#071D49]">{userInfo?.username || userInfo?.email}</p>
            {userInfo?.email && userInfo?.username !== userInfo?.email && (
              <p className="text-sm text-gray-500">{userInfo.email}</p>
            )}
          </div>
          
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition text-red-600"
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
