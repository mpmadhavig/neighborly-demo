import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { Calendar, FileText, DollarSign, Star } from 'lucide-react';

interface DashboardPageProps {
  onAcceptQuotation?: () => void;
  onNavigateToPayments?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onAcceptQuotation, onNavigateToPayments }) => {
  const { state } = useAuthContext();

  const handleAcceptQuotation = () => {
    if (onNavigateToPayments) {
      onNavigateToPayments();
    }
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Quotations</h1>
      <p className="text-xl text-gray-600 mb-8">
        Here's an overview of your cleaning services and quotations
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#CF0557] to-[#FB4D94] rounded-full flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-[#071D49]">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#CF0557] to-[#FB4D94] rounded-full flex items-center justify-center">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Quotations</p>
              <p className="text-2xl font-bold text-[#071D49]">1</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#CF0557] to-[#FB4D94] rounded-full flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-[#071D49]">$0</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#CF0557] to-[#FB4D94] rounded-full flex items-center justify-center">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rewards</p>
              <p className="text-2xl font-bold text-[#071D49]">50</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#071D49]">Your Quotation</h2>
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-[#071D49]">Standard Cleaning Package</p>
              <p className="text-sm text-gray-500">Requested on: Nov 7, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#CF0557]">$150</p>
              <p className="text-sm text-gray-500">One-time service</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Area:</span>
            <span className="font-semibold text-[#071D49]">Living room, Kitchen, 2 Bathrooms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Duration:</span>
            <span className="font-semibold text-[#071D49]">3 hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Pending Approval</span>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <button 
            onClick={handleAcceptQuotation}
            className="flex-1 bg-gradient-to-r from-[#071D49] to-[#0a2d6b] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
          >
            Make Appointment
          </button>
          <button className="flex-1 border-2 border-[#CF0557] text-[#CF0557] py-3 rounded-lg font-semibold hover:bg-[#CF0557] hover:text-white transition">
            Request Changes
          </button>
        </div>
      </div>
    </div>
  );
};
