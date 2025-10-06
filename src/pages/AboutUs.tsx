import React from "react";
import { useAboutSEO } from "../hooks/useSEO";
import { Car, Users, Shield, Award, Globe, Heart } from "lucide-react";

const AboutUs: React.FC = () => {
  // Apply SEO for About page
  useAboutSEO();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            About TaxiNearMe
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting passengers with reliable local taxi drivers to make transportation 
            safe, convenient, and accessible for everyone in your community.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To revolutionize local transportation by creating a trusted platform that connects 
              passengers with verified taxi drivers in their area. We believe everyone deserves 
              safe, reliable, and affordable transportation options at their fingertips.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading platform for local transportation services across India, 
              empowering drivers to grow their businesses while providing passengers with 
              seamless access to trusted transportation solutions in their communities.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">
                We prioritize the safety and security of both passengers and drivers through 
                verification processes and quality standards.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Focus</h3>
              <p className="text-gray-600">
                We support local drivers and businesses, helping strengthen communities 
                through better transportation connections.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in service quality, user experience, and 
                platform reliability to exceed expectations.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            How TaxiNearMe Works
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* For Passengers */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                For Passengers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Search Your Area</h4>
                    <p className="text-gray-600 text-sm">Find taxi drivers in your city and browse available services.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Compare Options</h4>
                    <p className="text-gray-600 text-sm">View driver profiles, ratings, and service details to make informed choices.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Connect Directly</h4>
                    <p className="text-gray-600 text-sm">Contact drivers directly to book your ride and discuss your travel needs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Drivers */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Car className="h-6 w-6 text-green-600 mr-3" />
                For Drivers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Create Your Profile</h4>
                    <p className="text-gray-600 text-sm">Register and create a detailed profile showcasing your services and experience.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Choose Your Plan</h4>
                    <p className="text-gray-600 text-sm">Select from our flexible plans to match your business needs and budget.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Grow Your Business</h4>
                    <p className="text-gray-600 text-sm">Receive booking requests and build your customer base in your local area.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600 text-sm sm:text-base">Registered Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600 text-sm sm:text-base">Cities Covered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">10K+</div>
            <div className="text-gray-600 text-sm sm:text-base">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600 text-sm sm:text-base">Platform Support</div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-blue-100 text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Whether you're a passenger looking for reliable transportation or a driver 
            wanting to grow your business, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Find a Driver
            </button>
            <button className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Become a Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
