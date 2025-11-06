import React from 'react';
import { Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#071D49] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FB4D94]">Molly Maid®</h3>
            <p className="text-gray-300">Professional cleaning services trusted for over 40 years</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#FB4D94]">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                (555) 123-4567
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@mollymaid.com
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#FB4D94]">Quick Links</h4>
            <div className="space-y-2 text-gray-300">
              <div className="hover:text-[#FB4D94] cursor-pointer transition">About Us</div>
              <div className="hover:text-[#FB4D94] cursor-pointer transition">Careers</div>
              <div className="hover:text-[#FB4D94] cursor-pointer transition">Ms. Molly Foundation</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 Molly Maid. All rights reserved. A Neighborly Company.</p>
        </div>
      </div>
    </footer>
  );
};
