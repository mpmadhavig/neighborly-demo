import React from 'react';
import { Zap, Shield, Clock, CheckCircle, Lightbulb, Power, Wrench, Home, AlertCircle, Settings } from 'lucide-react';

interface ServicesPageProps {
  setActiveTab: (tab: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setActiveTab }) => {
  const services = [
    {
      icon: <Lightbulb className="w-12 h-12" />,
      title: "Lighting Solutions",
      description: "Professional lighting installation, repairs, and upgrades for your home or business",
      features: ["Indoor & Outdoor Lighting", "LED Conversions", "Dimmer Installation", "Landscape Lighting"]
    },
    {
      icon: <Power className="w-12 h-12" />,
      title: "Outlet & Switch Repair",
      description: "Fast and reliable outlet and switch installation, repair, and replacement services",
      features: ["GFCI Outlets", "USB Outlets", "Switch Upgrades", "Safety Inspections"]
    },
    {
      icon: <Settings className="w-12 h-12" />,
      title: "Panel Upgrades",
      description: "Electrical panel upgrades to meet modern power demands safely and efficiently",
      features: ["Circuit Breaker Panels", "Fuse Box Replacement", "Capacity Upgrades", "Code Compliance"]
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: "Generator Installation",
      description: "Keep your power on with professional generator installation and maintenance",
      features: ["Whole-House Generators", "Portable Generators", "Automatic Transfer Switches", "Maintenance Plans"]
    },
    {
      icon: <Home className="w-12 h-12" />,
      title: "Home Inspections",
      description: "Comprehensive electrical safety inspections to protect your home and family",
      features: ["Safety Audits", "Code Compliance", "Wiring Inspections", "Detailed Reports"]
    },
    {
      icon: <AlertCircle className="w-12 h-12" />,
      title: "Emergency Services",
      description: "24/7 emergency electrical services when you need them most",
      features: ["24/7 Availability", "Rapid Response", "Power Restoration", "Safety First"]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Electrical Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional electrical solutions for residential and commercial needs. Licensed, insured, and ready to serve you 24/7.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition group"
          >
            <div className="text-yellow-500 mb-4 group-hover:scale-110 transition">
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {service.description}
            </p>
            <ul className="space-y-2">
              {service.features.map((feature, fidx) => (
                <li key={fidx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setActiveTab('contact')}
              className="mt-6 w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-600 transition"
            >
              Get Quote
            </button>
          </div>
        ))}
      </div>

      {/* Why Choose Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Mr. Electric?</h2>
          <p className="text-xl text-gray-600">Experience the difference of professional electrical service</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="font-bold text-gray-900 mb-2">Licensed & Insured</h4>
            <p className="text-gray-600 text-sm">Fully licensed electricians with comprehensive insurance coverage</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="font-bold text-gray-900 mb-2">Expert Technicians</h4>
            <p className="text-gray-600 text-sm">Highly trained and certified electrical professionals</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="font-bold text-gray-900 mb-2">On-Time Service</h4>
            <p className="text-gray-600 text-sm">We respect your time with punctual, reliable service</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <CheckCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="font-bold text-gray-900 mb-2">Customer Satisfaction</h4>
            <p className="text-gray-600 text-sm">Backed by our Neighborly Done Right Promise®</p>
          </div>
        </div>
      </section>
    </div>
  );
};
