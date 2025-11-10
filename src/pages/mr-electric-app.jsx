import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { Header } from '../components/mr-electric/Header';
import { Navigation } from '../components/mr-electric/Navigation';
import { Footer } from '../components/mr-electric/Footer';
import { HomePage } from '../components/mr-electric/HomePage';
import { ServicesPage } from '../components/mr-electric/ServicesPage';
import { AboutPage } from '../components/mr-electric/AboutPage';
import { ContactPage } from '../components/mr-electric/ContactPage';
import { User } from 'lucide-react';

export default function MrElectricApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState('');
  const authContext = useAuthContext();

  // Check for active session on mount and perform silent sign-in
  useEffect(() => {
    const checkSession = async () => {
      if (!authContext.state.isAuthenticated && !authContext.state.isLoading) {
        try {
          // Try to get access token silently
          const isSignedIn = await authContext.trySignInSilently();
          if (isSignedIn) {
            console.log('Silent sign-in successful');
          } else {
            console.log('Silent sign-in failed');
          }
        } catch (error) {
          // Silent sign-in failed, user needs to sign in manually
          console.log('No active session found');
        }
      }
    };

    checkSession();
  }, []);

  // Handle sign in with username modal
  const handleSignIn = () => {
    setShowUsernamePrompt(true);
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username) {
      authContext.signIn({ 
        prompt: 'login',
        username: username 
      });
      setShowUsernamePrompt(false);
      setUsername('');
    }
  };

  // Show loading state while authentication is being processed
  if (authContext.state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d4ed8]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isAuthenticated={authContext.state.isAuthenticated}
        onSignIn={handleSignIn}
        onSignOut={() => authContext.signOut()}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <HomePage setActiveTab={setActiveTab} />}
        {activeTab === 'services' && <ServicesPage setActiveTab={setActiveTab} />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage setActiveTab={setActiveTab} />}
      </main>

      <Footer />

      {/* Username Prompt Modal */}
      {showUsernamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 relative">
              <button
                onClick={() => setShowUsernamePrompt(false)}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Sign In</h2>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUsernameSubmit} className="p-6">
              <p className="text-gray-700 text-center mb-6">
                Enter your username or email to continue
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-blue-900">
                  Username or Email *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  placeholder="Enter your username"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md text-lg"
                >
                  Continue
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowUsernamePrompt(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

