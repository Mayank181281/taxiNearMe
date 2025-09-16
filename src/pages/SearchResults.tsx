import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import PrimeMembersCarousel from "../components/PrimeMembersCarousel";
import UnifiedDriverSection from "../components/UnifiedDriverSection";
import {
  getAllStates,
  getCitiesByState,
  getCategories,
} from "../utils/statesAndCities";
import { useAdDisplayExpiration } from "../hooks/useAutoExpiration";

const SearchResults: React.FC = () => {
  // Process expired ads before showing search results
  useAdDisplayExpiration();

  const { category, city } = useParams<{ category: string; city: string }>();
  const navigate = useNavigate();

  // States for the hero search form
  const [searchFormState, setSearchFormState] = useState("");
  const [searchFormCity, setSearchFormCity] = useState("");
  const [searchFormCategory, setSearchFormCategory] = useState("");

  // States for filtering results (used by PrimeMembersCarousel and RegularDriversSection)
  const [selectedCity, setSelectedCity] = useState("");
  const selectedState = "";

  // Get initial city from URL params
  useEffect(() => {
    if (city) {
      const decodedCity = decodeURIComponent(city);
      // Properly capitalize city name for display
      const formattedCity = decodedCity
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
      setSelectedCity(formattedCity);
    }
  }, [city]);

  // Handler for the hero search form
  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFormCity || searchFormState) {
      const searchQuery = searchFormCity || searchFormState;
      const categoryParam = searchFormCategory || category || "taxi";
      const formattedCategory = categoryParam
        .toLowerCase()
        .replace(/\s+/g, "-");
      navigate(
        `/${formattedCategory}/${encodeURIComponent(searchQuery.toLowerCase())}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image and Overlay - Identical to Home */}
      <section
        className="relative py-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/search-background.png')",
        }}
      >
        {/* Dark overlay - Identical to Home */}
        <div className="absolute inset-0 bg-opacity-0"></div>

        {/* Content - Identical structure to Home */}
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

        {/* Search Form - Positioned at bottom - IDENTICAL responsive behavior to Home */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-xs sm:max-w-2xl px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-2xl p-2.5 sm:p-6">
            <form
              onSubmit={handleFormSearch}
              className="flex flex-col sm:flex-row gap-1.5 sm:gap-4"
            >
              <div className="relative flex-1 sm:flex-[1.3] min-w-0">
                <select
                  value={searchFormCategory}
                  onChange={(e) => setSearchFormCategory(e.target.value)}
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
                  value={searchFormState}
                  onChange={(e) => {
                    setSearchFormState(e.target.value);
                    setSearchFormCity(""); // Clear city when state changes
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
                  value={searchFormCity}
                  onChange={(e) => setSearchFormCity(e.target.value)}
                  className="w-full px-2.5 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-xs sm:text-base"
                >
                  <option value="">Select City</option>
                  {(searchFormState
                    ? getCitiesByState(searchFormState)
                    : []
                  ).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
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

      {/* IDENTICAL spacing to Home page for all breakpoints */}
      <div className="pt-28 sm:pt-24 md:pt-20"></div>

      {/* VIP Prime Members Carousel */}
      <PrimeMembersCarousel
        selectedState={selectedState}
        selectedCity={selectedCity}
      />

      {/* Unified Drivers Section - All drivers in priority order */}
      <UnifiedDriverSection
        selectedState={selectedState}
        selectedCity={selectedCity}
      />
    </div>
  );
};

export default SearchResults;
