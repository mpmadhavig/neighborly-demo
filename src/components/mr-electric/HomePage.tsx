import React from 'react';
import { Zap, Phone, ArrowRight, CheckCircle } from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white rounded-3xl p-12 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-500 text-blue-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Zap className="w-4 h-4" />
              Trusted Since 1994
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Expert Electrical Services You Can Trust
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Licensed, insured, and ready to solve all your electrical needs. From repairs to installations, we're here 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a 
                href="tel:1-888-MRELECTRIC"
                className="bg-yellow-500 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Call: 1-888-MRELECTRIC
              </a>
              <button
                onClick={() => setActiveTab('contact')}
                className="bg-white/10 backdrop-blur text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition flex items-center justify-center gap-2"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-500" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-500" />
                <span>24/7 Emergency Service</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-500" />
                <span>Upfront Pricing</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition duration-300">
              <div className="bg-white rounded-2xl p-8 space-y-6">
                <div className="text-center">
                  <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Special Offer!</h3>
                  <p className="text-gray-700 font-semibold">20% OFF First Service</p>
                  <div className="mt-4 bg-yellow-100 border-2 border-dashed border-yellow-500 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Use Code:</p>
                    <p className="text-2xl font-bold text-blue-900">ELECTRIC20</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('contact')}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-800 hover:to-blue-600 transition"
                >
                  Claim Your Discount
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border-2 border-blue-200 hover:shadow-xl transition">
          <div className="text-5xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-2">
            <Zap className="w-12 h-12 text-yellow-500" />
            30+
          </div>
          <p className="text-xl text-blue-700 font-semibold">Years of Experience</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 text-center border-2 border-yellow-200 hover:shadow-xl transition">
          <div className="text-5xl font-bold text-blue-900 mb-2">4.9⭐</div>
          <p className="text-xl text-blue-700 font-semibold">Average Rating</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border-2 border-blue-200 hover:shadow-xl transition">
          <div className="text-5xl font-bold text-blue-900 mb-2">500K+</div>
          <p className="text-xl text-blue-700 font-semibold">Satisfied Customers</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-12 text-center shadow-2xl">
        <Zap className="w-16 h-16 text-blue-900 mx-auto mb-6" />
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
          Ready for Expert Electrical Service?
        </h2>
        <p className="text-xl text-blue-800 mb-8 max-w-2xl mx-auto">
          Join over 500,000 satisfied customers who trust Mr. Electric for safe, reliable electrical services
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="tel:1-888-MRELECTRIC"
            className="bg-blue-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition flex items-center gap-2 justify-center shadow-lg"
          >
            <Phone className="w-5 h-5" />
            Call Now
          </a>
          <button
            onClick={() => setActiveTab('contact')}
            className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition flex items-center gap-2 justify-center shadow-lg"
          >
            Request Quote
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
