import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProfileLayout: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to access your profile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">TAXI NEAR ME</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Post Ads
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">TAXI NEAR ME</h3>
              <p className="text-blue-100">
                Book Your Taxi In Seconds With Our Easy-to-Use Platform. Enjoy
                Safe Rides, Transparent Fares, And Trusted Drivers Across India.
                Available 24/7, Secure Payments, And Track Drivers Anytime,
                Anywhere.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Useful links</h4>
              <ul className="space-y-2 text-blue-100">
                <li>Home</li>
                <li>Contact</li>
                <li>List Member</li>
                <li>About Us</li>
                <li>Privacy</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Socials</h4>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  f
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  in
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  t
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  @
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
