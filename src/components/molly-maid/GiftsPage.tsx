import React from 'react';
import { Gift, Check } from 'lucide-react';

interface GiftsPageProps {
  setActiveTab: (tab: string) => void;
}

export const GiftsPage: React.FC<GiftsPageProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <Gift className="w-20 h-20 text-[#CF0557] mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Give the Gift of Time</h1>
      <p className="text-xl text-gray-600 mb-8">
        Give someone you care about more time to do the things they love with a Molly Maid gift certificate
      </p>

      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 rounded-2xl p-8 mb-8 border-2 border-[#FB4D94]">
        <h2 className="text-2xl font-bold mb-4 text-[#071D49]">Perfect for any occasion</h2>
        <ul className="text-left max-w-md mx-auto space-y-3">
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-[#CF0557]" />
            <span>Birthdays & Anniversaries</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-[#CF0557]" />
            <span>New Homeowners</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-[#CF0557]" />
            <span>New Parents</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-[#CF0557]" />
            <span>Holiday Gifts</span>
          </li>
        </ul>
      </div>

      <button 
        onClick={() => setActiveTab('booking')}
        className="bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
      >
        Purchase Gift Certificate
      </button>
    </div>
  );
};
