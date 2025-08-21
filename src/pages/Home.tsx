import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

const Home: React.FC = () => {
  const [searchCity, setSearchCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  // Extended cities to match the mockup
  const featuredCities = [
    "Mumbai",
    "Nagpur",
    "Nashik",
    "Noida",
    "Lucknow",
    "Agra",
    "Aligarh",
    "Allahabad",
    "Kolkata",
    "Pune",
    "Delhi",
    "Udaipur",
    "Jaipur",
    "Jodhpur",
    "Gurgaon",
    "Chennai",
    "Bangalore",
    "Ahmedabad",
    "Goa",
    "Chandigarh",
    "Ludhiana",
    "Dehradun",
    "Indore",
    "Rishikesh",
    "Aurangabad",
    "Kolhapur",
    "Ghaziabad",
    "Kanpur",
    "Mathura",
    "Meerut",
    "Varanasi",
    "Kota",
    "Pushkar",
    "Jalandhar",
    "Zirakpur",
    "Amritsar",
    "Mohali",
    "Vishakhapatnam",
    "Rajkot",
    "Surat",
    "Vadodara",
    "Patna",
    "Guwahati",
    "Mangalore",
    "Darjeeling",
    "Siliguri",
    "Jamshedpur",
    "Ranchi",
    "Kochi",
  ];

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
              <div className="relative flex-1">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-2.5 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-xs sm:text-base"
                >
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
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
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Surat">Surat</option>
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
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCityClick(city)}
                  className="bg-blue-400 hover:bg-blue-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  {city}
                </button>
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
