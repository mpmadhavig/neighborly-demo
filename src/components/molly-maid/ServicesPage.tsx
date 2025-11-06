import React from 'react';
import { Check } from 'lucide-react';
import { services } from './data';

interface ServicesPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedService: (service: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setActiveTab, setSelectedService }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Our Cleaning Services</h1>
      <p className="text-xl text-gray-600 mb-8">
        Custom home cleaning services tailored to your specific needs and preferences
      </p>

      <div className="space-y-6">
        {services.map(service => {
          const Icon = service.icon;
          return (
            <div key={service.id} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl hover:border-[#FB4D94] transition">
              <div className="flex items-start gap-4">
                <Icon className="w-12 h-12 text-[#CF0557] flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-[#071D49]">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Customizable cleaning plan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Professional cleaning team</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Quality guaranteed</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => {
                      setSelectedService(service.name);
                      setActiveTab('booking');
                    }}
                    className="bg-[#CF0557] text-white px-6 py-2 rounded-lg hover:bg-[#FB4D94] transition"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-8 mt-8 border-2 border-[#FB4D94]">
        <h2 className="text-2xl font-bold mb-4 text-[#071D49]">Custom Cleaning Solutions</h2>
        <p className="text-gray-700">
          We understand that every home is unique. Our team works closely with you to develop 
          a tailored cleaning plan that suits your lifestyle and budget. Whether you need regular 
          maintenance, deep cleaning, or help with a special occasion, we've got you covered.
        </p>
      </div>
    </div>
  );
};
