import React from 'react';
import { Home, Calendar, Star, Phone, LayoutDashboard, CreditCard, CalendarCheck, FileText } from 'lucide-react';
import { UserProfile } from './UserProfile';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, isAuthenticated = false }) => {

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#CF0557]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setActiveTab('home')}
            className="text-2xl font-bold text-[#CF0557] cursor-pointer hover:opacity-80 transition"
          >
            <img src="logo.png" alt="Molly Maid Logo" className="h-20 w-auto" />
          </button>
          <div className="flex items-center gap-4">
            <a href="tel:555-123-4567" className="flex items-center gap-2 text-[#071D49] hover:text-[#CF0557]">
              <Phone className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">(555) 123-4567</span>
            </a>
            <UserProfile />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'home' ? 'bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'booking' ? 'bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('quotations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === 'quotations' ? 'bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Quotations
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === 'appointments' ? 'bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              Appointments
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === 'payments' ? 'bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Payments
            </button>
          )}
          
        </div>
      </div>
    </nav>
  );
};
