import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Home: React.FC = () => {
  const [searchCity, setSearchCity] = useState("");
  const navigate = useNavigate();

  // Featured cities to display as buttons (24 cities as shown in the reference)
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Browse By City Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-0">
              Browse By City
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search City.."
                className="w-80 px-4 py-2 pr-12 border-2 border-gray-300 rounded-full text-black placeholder-gray-500 focus:outline-none focus:border-gray-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* City Buttons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredCities.map((city, index) => (
              <button
                key={index}
                onClick={() => handleCityClick(city)}
                className="bg-red-400 hover:bg-red-500 text-white py-3 px-6 rounded-full font-medium transition-colors duration-200 text-center"
              >
                {city}
              </button>
            ))}
          </div>
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
