import React from 'react';
import { Shield, Award, Users, TrendingUp, Zap, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <Zap className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-900 mb-4">About Mr. Electric</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Since 1994, Mr. Electric has been North America's trusted electrical services provider, 
          delivering safe, reliable solutions to homes and businesses.
        </p>
      </section>

      {/* Our Story */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 1994, Mr. Electric has grown from a single location to a nationwide network 
              of electrical service professionals. We're proud to be part of the Neighborly® family 
              of home service brands.
            </p>
            <p className="text-gray-700 mb-4">
              Our commitment to safety, quality, and customer satisfaction has made us the go-to 
              choice for electrical services across North America.
            </p>
            <p className="text-gray-700">
              Every Mr. Electric technician is licensed, insured, and background-checked, ensuring 
              you receive professional service you can trust.
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-8">
            <div className="bg-white rounded-xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Award className="w-8 h-8 text-blue-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">30+ Years</h4>
                    <p className="text-gray-600 text-sm">Industry Experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="w-8 h-8 text-blue-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">500K+</h4>
                    <p className="text-gray-600 text-sm">Satisfied Customers</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-8 h-8 text-blue-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">4.9/5</h4>
                    <p className="text-gray-600 text-sm">Customer Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section>
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition">
            <Shield className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Safety First</h3>
            <p className="text-gray-600">
              We prioritize safety in every job, following strict electrical codes and industry 
              best practices to protect you and your property.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition">
            <Award className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Quality Service</h3>
            <p className="text-gray-600">
              Our licensed electricians deliver exceptional workmanship on every project, 
              backed by our satisfaction guarantee.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition">
            <Users className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Focus</h3>
            <p className="text-gray-600">
              Your satisfaction is our priority. We provide transparent pricing, clear 
              communication, and reliable service every time.
            </p>
          </div>
        </div>
      </section>

      {/* Neighborly Promise */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl p-12 text-white text-center">
        <Shield className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-6">The Neighborly Done Right Promise®</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          As a Neighborly company, we stand behind our work with the Neighborly Done Right Promise® - 
          a commitment to exceptional service and customer satisfaction.
        </p>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-yellow-500" />
            <span className="font-semibold">Background-Checked</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-yellow-500" />
            <span className="font-semibold">Code Compliant</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-yellow-500" />
            <span className="font-semibold">Same-Day Service</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-yellow-500" />
            <span className="font-semibold">Upfront Pricing</span>
          </div>
        </div>
      </section>
    </div>
  );
};
