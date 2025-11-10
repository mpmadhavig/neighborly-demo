import React, { useState } from 'react';
import { Zap, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

interface ContactPageProps {
  setActiveTab: (tab: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'general',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting Mr. Electric! We\'ll get back to you shortly.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: 'general',
      message: ''
    });
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Get Your Free Quote Today!</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Schedule your electrical service or emergency repair now. We're available 24/7 to serve you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-8 shadow-2xl">
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Request a Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Needed *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  <option value="general">General Inquiry</option>
                  <option value="repair">Electrical Repair</option>
                  <option value="installation">Installation</option>
                  <option value="inspection">Safety Inspection</option>
                  <option value="emergency">Emergency Service</option>
                  <option value="upgrade">Panel Upgrade</option>
                  <option value="generator">Generator Installation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Tell us about your electrical needs..."
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-800 hover:to-blue-600 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Request Free Quote
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-center text-sm text-gray-600">
                Or call us directly: <a href="tel:1-888-MRELECTRIC" className="font-bold text-blue-900 hover:text-blue-700">1-888-MRELECTRIC</a>
              </p>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone</h4>
                  <a href="tel:1-888-MRELECTRIC" className="text-blue-200 hover:text-white transition">
                    1-888-MRELECTRIC<br />
                    (1-888-673-5328)
                  </a>
                  <p className="text-sm text-blue-300 mt-1">Available 24/7 for emergencies</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <a href="mailto:info@mrelectric.com" className="text-blue-200 hover:text-white transition">
                    info@mrelectric.com
                  </a>
                  <p className="text-sm text-blue-300 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Service Area</h4>
                  <p className="text-blue-200">
                    Serving communities nationwide
                  </p>
                  <p className="text-sm text-blue-300 mt-1">Find your local Mr. Electric</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Licensed & insured electricians</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">24/7 emergency service available</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Upfront, transparent pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Neighborly Done Right Promise®</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Same-day service available</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Special Offer!</h3>
            <p className="text-gray-700 mb-4">Get 20% OFF your first service with code:</p>
            <div className="bg-yellow-100 border-2 border-dashed border-yellow-500 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-900">ELECTRIC20</p>
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">Valid for 60 days. New customers only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
