import React from 'react';
import { Check, Star, Users } from 'lucide-react';
import { services, testimonials } from './data';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  setSelectedService: (service: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, setSelectedService }) => {
  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional House Cleaning Services</h1>
        <p className="text-xl mb-6">Trusted for 40+ years to get the job done right</p>
        <button 
          onClick={() => setActiveTab('booking')}
          className="bg-white text-[#CF0557] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Request Free Estimate
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-pink-50 p-6 rounded-xl border-2 border-[#FB4D94]">
          <Check className="w-12 h-12 text-[#CF0557] mb-4" />
          <h3 className="text-xl font-bold mb-2 text-[#071D49]">No Contracts</h3>
          <p className="text-gray-700">Flexible plans that fit your needs without long-term commitments</p>
        </div>
        <div className="bg-pink-50 p-6 rounded-xl border-2 border-[#FB4D94]">
          <Star className="w-12 h-12 text-[#CF0557] mb-4" />
          <h3 className="text-xl font-bold mb-2 text-[#071D49]">Quality Guaranteed</h3>
          <p className="text-gray-700">Done Right Promise ensures satisfaction or we'll make it right</p>
        </div>
        <div className="bg-pink-50 p-6 rounded-xl border-2 border-[#FB4D94]">
          <Users className="w-12 h-12 text-[#CF0557] mb-4" />
          <h3 className="text-xl font-bold mb-2 text-[#071D49]">Trained Professionals</h3>
          <p className="text-gray-700">Well-trained cleaning experts you can trust in your home</p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 text-[#071D49]">Our Services</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map(service => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-[#FB4D94] transition">
                <Icon className="w-10 h-10 text-[#CF0557] mb-3" />
                <h3 className="text-xl font-bold mb-2 text-[#071D49]">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button 
                  onClick={() => {
                    setSelectedService(service.name);
                    setActiveTab('booking');
                  }}
                  className="text-[#CF0557] font-semibold hover:underline"
                >
                  Learn More →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border-2 border-[#FB4D94]">
        <h2 className="text-3xl font-bold mb-6 text-[#071D49]">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FB4D94] fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-3">"{testimonial.text}"</p>
              <p className="font-semibold text-[#071D49]">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
