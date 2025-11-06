import React, { useState } from 'react';
import { Header } from '../components/molly-maid/Header';
import { Navigation } from '../components/molly-maid/Navigation';
import { Footer } from '../components/molly-maid/Footer';
import { HomePage } from '../components/molly-maid/HomePage';
import { ServicesPage } from '../components/molly-maid/ServicesPage';
import { BookingPage } from '../components/molly-maid/BookingPage';
import { BlogPage } from '../components/molly-maid/BlogPage';
import { GiftsPage } from '../components/molly-maid/GiftsPage';

export default function MollyMaidApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    zipCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your request! We will contact you shortly to schedule your cleaning service.');
    setFormData({
      email: '',
      address: '',
      zipCode: ''
    });
  };

  const handleBookNowClick = async () => {
    try {
      // Uncomment and use when needed
      // const result = await initiateRegistrationFlow();
      // console.log('Registration flow initiated:', result);
      setActiveTab('booking');
    } catch (error) {
      console.error('Error during registration flow:', error);
      // Still navigate to booking even if API call fails
      setActiveTab('booking');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <HomePage setActiveTab={setActiveTab} setSelectedService={setSelectedService} />}
        {activeTab === 'services' && <ServicesPage setActiveTab={setActiveTab} setSelectedService={setSelectedService} />}
        {activeTab === 'booking' && <BookingPage formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />}
        {activeTab === 'blog' && <BlogPage />}
        {activeTab === 'gifts' && <GiftsPage setActiveTab={setActiveTab} />}
      </main>

      <Footer />
    </div>
  );
}
