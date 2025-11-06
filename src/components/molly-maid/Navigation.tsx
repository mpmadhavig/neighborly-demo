import React from 'react';
import { Home, Calendar, Gift, BookOpen, Star, Phone } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#CF0557]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-[#CF0557]">Molly Maid®</div>
          <div className="flex gap-4">
            <a href="tel:555-123-4567" className="flex items-center gap-2 text-[#071D49] hover:text-[#CF0557]">
              <Phone className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">(555) 123-4567</span>
            </a>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'home' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'services' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
            }`}
          >
            <Star className="w-4 h-4" />
            Services
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'booking' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'blog' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Blog
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === 'gifts' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
            }`}
          >
            <Gift className="w-4 h-4" />
            Gift Certificates
          </button>
        </div>
      </div>
    </nav>
  );
};
