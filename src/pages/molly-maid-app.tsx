import React, { useState } from 'react';
import { Home, Calendar, Gift, BookOpen, Users, Check, Star, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function MollyMaidApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    frequency: '',
    bedrooms: '1',
    bathrooms: '1',
    preferredDate: ''
  });

  const services = [
    { id: 1, name: 'Regular Cleaning', description: 'Recurring cleaning services tailored to your schedule', icon: Home },
    { id: 2, name: 'Deep Cleaning', description: 'Thorough cleaning for every corner of your home', icon: Star },
    { id: 3, name: 'Move In/Out Cleaning', description: 'Complete cleaning for moving transitions', icon: Calendar },
    { id: 4, name: 'Specialty Cleaning', description: 'Custom cleaning for specific needs', icon: Check }
  ];

  const testimonials = [
    { name: 'Sarah M.', rating: 5, text: 'Outstanding service! My home has never been cleaner.' },
    { name: 'John D.', rating: 5, text: 'Professional, reliable, and thorough. Highly recommend!' },
    { name: 'Emily R.', rating: 5, text: 'The team is amazing. They pay attention to every detail.' }
  ];

  const blogPosts = [
    { title: 'How Often Should I Have My House Cleaned?', excerpt: 'Factors to consider when deciding the frequency of professional cleanings.' },
    { title: 'Cleaning Schedule For Working Parents', excerpt: '10 best cleaning tips for busy moms and dads.' },
    { title: 'House Cleaning Tips for Seniors', excerpt: 'Advice to help seniors stay self-sufficient with cleaning.' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your request! We will contact you shortly to schedule your cleaning service.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      serviceType: '',
      frequency: '',
      bedrooms: '1',
      bathrooms: '1',
      preferredDate: ''
    });
  };

  const renderHome = () => (
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

  const renderServices = () => (
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

  const renderBooking = () => (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Request a Free Estimate</h1>
      <p className="text-xl text-gray-600 mb-8">
        Fill out the form below and we'll contact you to schedule your cleaning service
      </p>

      <div className="bg-white border-2 border-[#FB4D94] rounded-xl p-8 space-y-6 shadow-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[#071D49]">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
            placeholder="123 Main St, City, State ZIP"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[#071D49]">Service Type *</label>
          <select
            name="serviceType"
            value={formData.serviceType || selectedService || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.name}>{service.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[#071D49]">Cleaning Frequency</label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
          >
            <option value="">Select frequency</option>
            <option value="one-time">One-time</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#071D49]">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF0557] focus:border-[#CF0557] outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
        >
          Request Free Estimate
        </button>
      </div>

      <div className="mt-8 bg-green-50 border-2 border-green-300 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2 text-green-800">The Neighborly Done Right Promise®</h3>
        <p className="text-green-700">
          If your service isn't right, contact us by the next business day and we'll make it right, 
          at no extra cost. Guaranteed satisfaction or your money back.
        </p>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Practically Spotless Blog</h1>
      <p className="text-xl text-gray-600 mb-8">Expert advice from our team of cleaning specialists</p>

      <div className="space-y-6">
        {blogPosts.map((post, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl hover:border-[#FB4D94] transition">
            <h3 className="text-2xl font-bold mb-3 text-[#071D49]">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <button className="text-[#CF0557] font-semibold hover:underline">
              Read More →
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-8 border-2 border-[#FB4D94]">
        <h2 className="text-2xl font-bold mb-4 text-[#071D49]">Cleaning Tips Categories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold mb-2 text-[#071D49]">General Household</h4>
            <p className="text-sm text-gray-600">Tips for everyday cleaning tasks</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold mb-2 text-[#071D49]">Kitchen & Dining</h4>
            <p className="text-sm text-gray-600">Keep your kitchen spotless</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold mb-2 text-[#071D49]">Bathroom</h4>
            <p className="text-sm text-gray-600">Deep cleaning strategies</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGifts = () => (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-blue-500" style={{backgroundColor: '#071d49', padding: '5px'}}>
        <div>
          <a href="https://www.neighborly.com/"
           title="White Neighborly logo. - open in new tab" 
           target="_blank">
           <img src="neighborly-logo.png" alt="White Neighborly logo." width="83" height="17" />      
          </a>
      </div>
      </div>
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#CF0557]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-[#CF0557]">Molly Maid®</div>
            <div className="flex gap-4">
              <a href="tel:555-123-4567" className="flex items-center gap-2 text-[#071D49] hover:text-[#CF0557]">
                <Phone className="w-5 h-5" />
                <span className="hidden md:inline font-semibold">(555) 123-4567</span>
              </a>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === 'home' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === 'services' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
              }`}
            >
              <Star className="w-4 h-4" />
              Services
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === 'booking' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === 'blog' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === 'gifts' ? 'bg-gradient-to-r from-[#CF0557] to-[#FB4D94] text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'
              }`}
            >
              <Gift className="w-4 h-4" />
              Gift Certificates
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'booking' && renderBooking()}
        {activeTab === 'blog' && renderBlog()}
        {activeTab === 'gifts' && renderGifts()}
      </main>

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
    </div>
  );

  const handleBookNowClick = () => {

    // Make the below API call.
    /**
    curl --location 'https://api.asgardeo.io/t/vihanga3/api/server/v1/flow/execute' \
    --header 'Content-Type: application/json' \
    --data '{
      "flowType": "REGISTRATION"
    }'
     */

    setActiveTab('booking');

  };
}
