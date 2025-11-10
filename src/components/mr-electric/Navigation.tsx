import React from 'react';
import { Home, Wrench, Phone, FileText, Award, Zap, LogIn, LogOut, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAuthenticated = false,
  onSignIn,
  onSignOut
}) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer hover:opacity-80 transition"
          >
            <img src="mrelectric-home.png" alt="Mr. Electric Logo" className="h-20 w-auto" />
          </button>
          <div className="flex items-center gap-4">
            <a 
              href="tel:1-888-MRELECTRIC" 
              className="flex items-center gap-2 text-blue-900 hover:text-yellow-600 transition font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden md:inline">1-888-MRELECTRIC</span>
            </a>
            {isAuthenticated ? (
              <button 
                onClick={onSignOut}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-gray-500 hover:to-gray-600 transition shadow-md"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <button 
                onClick={onSignIn}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-600 transition shadow-md"
              >
                <LogIn className="w-4 h-4" />
                view quotations
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'home' 
                ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'services' 
                ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Services
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'about' 
                ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Award className="w-4 h-4" />
            About
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'contact' 
                ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};
