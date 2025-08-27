import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Car, MapPin, Bus } from "lucide-react";
import {
  getAllStates,
  getCitiesByState,
  getAllCities,
  getCategories,
} from "../utils/statesAndCities";

const Home: React.FC = () => {
  const [searchCity, setSearchCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const navigate = useNavigate();

  // Extended cities from the shared utility
  const featuredCities = getAllCities();

  const handleCityClick = (city: string) => {
    navigate(`/search?city=${encodeURIComponent(city)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/search?city=${encodeURIComponent(searchCity.trim())}`);
    }
  };

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity || selectedState) {
      const searchQuery = selectedCity || selectedState;
      navigate(`/search?city=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Filter cities based on search input
  const filteredCities = featuredCities.filter((city) =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image and Overlay */}
      <section
        className="relative py-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/search-background.png')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <p className="text-lg mb-4 font-medium opacity-90">
            Finding Best Taxis Near you.
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            "Your Journey, Our Priority"
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-light opacity-90">
            Easy bookings, trusted drivers, and rides that fit your schedule.
          </p>
        </div>

        {/* Search Form - Positioned at bottom */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-xs sm:max-w-2xl px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-2xl p-2.5 sm:p-6">
            <form
              onSubmit={handleFormSearch}
              className="flex flex-col sm:flex-row gap-1.5 sm:gap-4"
            >
              <div className="relative flex-1 sm:flex-[1.3] min-w-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-2.5 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-xs sm:text-base"
                >
                  <option value="">Select Category</option>
                  {getCategories().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity(""); // Clear city when state changes
                  }}
                  className="w-full px-2.5 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-xs sm:text-base"
                >
                  <option value="">Select State</option>
                  {getAllStates().map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-2.5 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-xs sm:text-base"
                >
                  <option value="">Select City</option>
                  {(selectedState ? getCitiesByState(selectedState) : []).map(
                    (city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-2.5 sm:px-6 py-1.5 sm:py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 text-xs sm:text-base sm:min-w-[120px]"
              >
                <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Service Cards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center gap-8 md:gap-16">
            {/* Taxi Card */}
            <div className="group cursor-pointer transition-all duration-500 hover:scale-105">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12 w-72 md:w-80 h-72 md:h-80 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-200/50 group-hover:-translate-y-3">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-500/0 to-blue-600/0 transition-all duration-500 group-hover:from-blue-400/10 group-hover:via-blue-500/5 group-hover:to-blue-600/10"></div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                  <div className="w-8 h-8 bg-blue-300 rounded-full blur-sm"></div>
                </div>

                {/* Icon Container */}
                <div className="relative mb-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-3">
                  {/* Icon Background Circle */}
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-200/50">
                      <Car className="h-10 w-10 md:h-12 md:w-12 text-blue-600 transition-all duration-500 group-hover:text-blue-700 group-hover:scale-110" />
                    </div>

                    {/* Animated Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-0 scale-75 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 group-hover:animate-pulse"></div>

                    {/* Dot indicators */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:animate-bounce"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 transition-all duration-700 delay-150 group-hover:opacity-100 group-hover:animate-bounce"></div>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-blue-600 transition-all duration-500 group-hover:text-blue-700 group-hover:scale-105">
                  Taxi
                </h3>

                {/* Subtitle that appears on hover */}
                <p className="text-sm text-blue-500 opacity-0 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                  Quick & Reliable Rides
                </p>
              </div>
            </div>

            {/* Tours & Travels Card */}
            <div className="group cursor-pointer transition-all duration-500 hover:scale-105">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12 w-72 md:w-80 h-72 md:h-80 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-200/50 group-hover:-translate-y-3">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-500/0 to-blue-600/0 transition-all duration-500 group-hover:from-blue-400/10 group-hover:via-blue-500/5 group-hover:to-blue-600/10"></div>

                {/* Floating Elements */}
                <div className="absolute top-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                  <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                  <div className="w-10 h-10 bg-blue-300 rounded-full blur-sm"></div>
                </div>

                {/* Icon Container */}
                <div className="relative mb-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:-rotate-3">
                  {/* Icon Background Circle */}
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-200/50">
                      <Bus className="h-10 w-10 md:h-12 md:w-12 text-blue-600 transition-all duration-500 group-hover:text-blue-700 group-hover:scale-110" />
                    </div>

                    {/* Animated Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-0 scale-75 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 group-hover:animate-pulse"></div>

                    {/* Dot indicators */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:animate-bounce"></div>
                    <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 transition-all duration-700 delay-150 group-hover:opacity-100 group-hover:animate-bounce"></div>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-blue-600 transition-all duration-500 group-hover:text-blue-700 group-hover:scale-105 text-center">
                  Tours & Travels
                </h3>

                {/* Subtitle that appears on hover */}
                <p className="text-sm text-blue-500 opacity-0 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 text-center">
                  Comfortable Long Distance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse By City Section */}
      <section className="py-16 pt-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12 gap-6 md:gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Browse by city
            </h2>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full md:w-auto"
            >
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search city"
                className="w-full md:w-80 px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
              />
              <button
                type="submit"
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </form>
          </div>

          {/* City Buttons Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 sm:gap-12">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <button
                    onClick={() => handleCityClick(city)}
                    className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                  >
                    {city}
                  </button>

                  {/* Hover Dropdown */}
                  {hoveredCity === city && (
                    <>
                      {/* Top Option */}
                      <div className="absolute bottom-full left-0 right-0 mb-1 z-10">
                        <button
                          onClick={() => handleCityClick(city)}
                          className="w-full px-4 py-2.5 bg-white text-gray-700 hover:bg-blue-50 transition-colors rounded-lg shadow-lg border border-gray-200 text-sm"
                        >
                          <span className="font-medium">Taxi</span>
                          <span className="text-gray-500 ml-1">- {city}</span>
                        </button>
                      </div>

                      {/* Bottom Option */}
                      <div className="absolute top-full left-0 right-0 mt-1 z-10">
                        <button
                          onClick={() => handleCityClick(city)}
                          className="w-full px-4 py-2.5 bg-white text-gray-700 hover:bg-blue-50 transition-colors rounded-lg shadow-lg border border-gray-200 text-sm"
                        >
                          <span className="font-medium">Tour and Travels</span>
                          <span className="text-gray-500 ml-1">- {city}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 text-lg">
                  No cities found matching "{searchCity}"
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
