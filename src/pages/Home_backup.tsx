import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Home: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const navigate = useNavigate();

  const states = getAllStates();

  useEffect(() => {
    if (selectedState) {
      const stateCities = getCitiesByState(selectedState);
      setAvailableCities(stateCities);
      setSelectedCity(""); // Reset city when state changes
    } else {
      setAvailableCities(cities);
    }
  }, [selectedState]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setShowStateDropdown(false);
        setShowCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity) {
      navigate(`/search?city=${encodeURIComponent(selectedCity)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section - Simple */}
      <section className="bg-white border-b-2 border-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Find Your Taxi Driver
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Search for verified drivers in your city. Simple and reliable
              transportation service.
            </p>
          </div>

          {/* Search Form - Simple */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="bg-white p-4">
              <div className="flex flex-col md:flex-row gap-3">
                {/* State Dropdown - Simple */}
                <div className="flex-1 relative dropdown-container">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStateDropdown(!showStateDropdown);
                      setShowCityDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left bg-white text-black border-2 border-gray-400 flex items-center justify-between"
                  >
                    <span
                      className={selectedState ? "text-black" : "text-gray-600"}
                    >
                      {selectedState || "Select State"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                  {showStateDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-400 mt-1 z-20 max-h-48 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedState("");
                          setShowStateDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-200 text-black border-b border-gray-300"
                      >
                        Select State
                      </button>
                      {states.map((state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => {
                            setSelectedState(state);
                            setShowStateDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-200 text-black border-b border-gray-300 last:border-b-0"
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* City Dropdown - Simple */}
                <div className="flex-1 relative dropdown-container">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCityDropdown(!showCityDropdown);
                      setShowStateDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left bg-white text-black border-2 border-gray-400 flex items-center justify-between"
                  >
                    <span
                      className={selectedCity ? "text-black" : "text-gray-600"}
                    >
                      {selectedCity || "Select City"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                  {showCityDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-400 mt-1 z-20 max-h-48 overflow-y-auto">
                      {(selectedState ? availableCities : cities).map(
                        (city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              setSelectedCity(city);
                              setShowCityDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-200 text-black border-b border-gray-300 last:border-b-0"
                          >
                            {city}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Search Button - Simple */}
                <button
                  type="submit"
                  disabled={!selectedCity}
                  className="bg-blue-700 text-white px-6 py-2 font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border-2 border-blue-700"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* CTA Section - Simple */}
      <section className="py-16 bg-gray-300 border-t-2 border-gray-500">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black">
            Join Our Platform
          </h2>
          <p className="text-lg text-gray-800 mb-8 max-w-xl mx-auto">
            Register as a driver and start earning. Simple registration process.
          </p>
          <div className="flex justify-center">
            <a
              href="/driver/register"
              className="bg-blue-700 text-white px-6 py-3 font-medium hover:bg-blue-800 border-2 border-blue-700 text-center"
            >
              Register as Driver
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
