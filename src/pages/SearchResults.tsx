import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import PrimeMembersCarousel from "../components/PrimeMembersCarousel";
import RegularDriversSection from "../components/RegularDriversSection";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // States for the hero search form
  const [searchFormState, setSearchFormState] = useState("");
  const [searchFormCity, setSearchFormCity] = useState("");

  // States for filtering results (used by PrimeMembersCarousel and RegularDriversSection)
  const [selectedCity, setSelectedCity] = useState("");
  const selectedState = "";

  // Get initial city from URL params
  useEffect(() => {
    const cityParam = searchParams.get("city");
    console.log("SearchResults - URL city param:", cityParam);
    if (cityParam) {
      setSelectedCity(cityParam);
      console.log("SearchResults - selectedCity set to:", cityParam);
    }
  }, [searchParams]);

  // Handler for the hero search form
  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFormCity || searchFormState) {
      const searchQuery = searchFormCity || searchFormState;
      navigate(`/search?city=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search Form */}
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

        {/* Search Form - Positioned to avoid tagline overlap - Mobile optimized */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-full max-w-[280px] xs:max-w-xs sm:max-w-2xl px-3 xs:px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-2xl p-2 xs:p-2.5 sm:p-6">
            <form
              onSubmit={handleFormSearch}
              className="flex flex-col sm:flex-row gap-1 xs:gap-1.5 sm:gap-4"
            >
              <div className="relative flex-1">
                <select
                  value={searchFormState}
                  onChange={(e) => setSearchFormState(e.target.value)}
                  className="w-full px-2 xs:px-2.5 sm:px-4 py-1 xs:py-1.5 sm:py-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-[10px] xs:text-xs sm:text-base"
                >
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
                <ChevronDown className="absolute right-1.5 xs:right-2.5 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={searchFormCity}
                  onChange={(e) => setSearchFormCity(e.target.value)}
                  className="w-full px-2 xs:px-2.5 sm:px-4 py-1 xs:py-1.5 sm:py-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-[10px] xs:text-xs sm:text-base"
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
                <ChevronDown className="absolute right-1.5 xs:right-2.5 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-2 xs:px-2.5 sm:px-6 py-1 xs:py-1.5 sm:py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs sm:text-base sm:min-w-[120px]"
              >
                <Search className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Search</span>
                <span className="xs:hidden">Go</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Moderate spacing for slight search form overlap */}
      <div className="pt-12 sm:pt-10"></div>

      {/* Prime Members Carousel */}
      <PrimeMembersCarousel
        selectedState={selectedState}
        selectedCity={selectedCity}
      />

      {/* Regular Drivers Section */}
      <RegularDriversSection
        selectedState={selectedState}
        selectedCity={selectedCity}
      />
    </div>
  );
};

export default SearchResults;
