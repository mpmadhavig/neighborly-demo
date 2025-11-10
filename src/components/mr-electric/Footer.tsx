import React from 'react';
import { Phone, Mail, MapPin, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-950 to-blue-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-yellow-500" />
              <h3 className="text-xl font-bold text-yellow-500">Mr. Electric®</h3>
            </div>
            <p className="text-blue-200">Expert electrical services you can trust since 1994</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-yellow-500">Contact Us</h4>
            <div className="space-y-2 text-blue-200">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-500" />
                1-888-MRELECTRIC
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-500" />
                info@mrelectric.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                Serving communities nationwide
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-yellow-500">Quick Links</h4>
            <div className="space-y-2 text-blue-200">
              <div className="hover:text-yellow-500 cursor-pointer transition">About Us</div>
              <div className="hover:text-yellow-500 cursor-pointer transition">Careers</div>
              <div className="hover:text-yellow-500 cursor-pointer transition">Locations</div>
              <div className="hover:text-yellow-500 cursor-pointer transition">Franchising</div>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8 text-center">
          <p className="text-blue-300 mb-2">
            Part of the <span className="font-bold text-white">Neighborly®</span> family of home service brands
          </p>
          <p className="text-blue-400 text-sm">
            © 2025 Mr. Electric. All rights reserved. | Licensed & Insured
          </p>
        </div>
      </div>
    </footer>
  );
};
