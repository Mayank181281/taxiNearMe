import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Car, MessageCircle, Crown, Star, Shield } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  title: string;
  rating: number;
  vehicleType: string;
  vehicleModel: string;
  location: string;
  state: string;
  city: string;
  phone: string;
  profileImage: string;
  isPrime?: boolean;
  isVIP?: boolean;
  priority: number; // 1 = VIP Prime, 2 = VIP, 3 = Regular
}

interface UnifiedDriverSectionProps {
  selectedState?: string;
  selectedCity?: string;
}

const UnifiedDriverSection: React.FC<UnifiedDriverSectionProps> = ({
  selectedState,
  selectedCity,
}) => {
  const navigate = useNavigate();
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 10;

  // All drivers data with priority system
  const allDrivers: Driver[] = useMemo(
    () => [
      // VIP PRIME DRIVERS (Priority 1)
      {
        id: "1",
        name: "Rajesh Kumar",
        title: "this is title ad",
        rating: 4.9,
        vehicleType: "Luxury Sedan",
        vehicleModel: "BMW 3 Series",
        location: "Connaught Place, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543210",
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
        isVIP: false,
        priority: 1,
      },
      {
        id: "2",
        name: "Priya Sharma",
        title: "this is title ad",
        rating: 4.8,
        vehicleType: "Electric SUV",
        vehicleModel: "Tesla Model Y",
        location: "Bandra West, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543211",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
        isVIP: false,
        priority: 1,
      },
      {
        id: "3",
        name: "Mohammed Ali",
        title: "this is title ad",
        rating: 4.7,
        vehicleType: "Premium SUV",
        vehicleModel: "Toyota Fortuner",
        location: "Koramangala, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543212",
        profileImage:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
        isVIP: false,
        priority: 1,
      },

      // VIP DRIVERS (Priority 2)
      {
        id: "201",
        name: "Mahesh Varma",
        title: "this is title ad",
        rating: 4.7,
        vehicleType: "Premium Sedan",
        vehicleModel: "Toyota Camry",
        location: "CP, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543301",
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: true,
        priority: 2,
      },
      {
        id: "202",
        name: "Sunita Devi",
        title: "this is title ad",
        rating: 4.6,
        vehicleType: "Premium SUV",
        vehicleModel: "Honda CR-V",
        location: "Bandra, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543302",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: true,
        priority: 2,
      },

      // REGULAR DRIVERS (Priority 3)
      {
        id: "101",
        name: "Suresh Gupta",
        title: "this is title ad",
        rating: 4.5,
        vehicleType: "Sedan",
        vehicleModel: "Honda City",
        location: "Lajpat Nagar, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543220",
        profileImage:
          "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "102",
        name: "Amit Verma",
        title: "this is title ad",
        rating: 4.3,
        vehicleType: "Hatchback",
        vehicleModel: "Maruti Swift",
        location: "Andheri East, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543221",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "103",
        name: "Deepak Singh",
        title: "this is title ad",
        rating: 4.4,
        vehicleType: "SUV",
        vehicleModel: "Mahindra XUV500",
        location: "Whitefield, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543222",
        profileImage:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "104",
        name: "Ravi Patel",
        title: "this is title ad",
        rating: 4.2,
        vehicleType: "Sedan",
        vehicleModel: "Toyota Corolla",
        location: "Sector 62, Noida",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543223",
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "105",
        name: "Vikash Kumar",
        title: "this is title ad",
        rating: 4.1,
        vehicleType: "Hatchback",
        vehicleModel: "Hyundai i20",
        location: "Salt Lake, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543224",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      // Additional VIP Prime drivers
      {
        id: "4",
        name: "Kavita Reddy",
        title: "this is title ad",
        rating: 4.9,
        vehicleType: "Luxury SUV",
        vehicleModel: "Audi Q5",
        location: "Banjara Hills, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543232",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
        isVIP: false,
        priority: 1,
      },
      {
        id: "5",
        name: "Arshan Sheikh",
        title: "this is title ad",
        rating: 4.8,
        vehicleType: "Executive Sedan",
        vehicleModel: "Mercedes C-Class",
        location: "Juhu, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543233",
        profileImage:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
        isVIP: false,
        priority: 1,
      },
      // Additional VIP drivers
      {
        id: "203",
        name: "Neha Tripathi",
        title: "this is title ad",
        rating: 4.6,
        vehicleType: "Premium Hatchback",
        vehicleModel: "Volkswagen Polo GT",
        location: "Gomti Nagar, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543234",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: true,
        priority: 2,
      },
      {
        id: "204",
        name: "Rajat Khanna",
        title: "this is title ad",
        rating: 4.5,
        vehicleType: "Premium Sedan",
        vehicleModel: "Honda Accord",
        location: "Sector 18, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543235",
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: true,
        priority: 2,
      },
    ],
    []
  );

  // Filter and sort drivers based on priority and location
  useEffect(() => {
    let filtered = [...allDrivers];

    // Filter by location
    if (selectedCity && selectedCity !== "all") {
      filtered = filtered.filter((driver) => driver.city === selectedCity);
    } else if (selectedState && selectedState !== "all") {
      filtered = filtered.filter((driver) => driver.state === selectedState);
    }

    // Sort by priority (1 = VIP Prime first, 2 = VIP second, 3 = Regular last)
    filtered.sort((a, b) => a.priority - b.priority);

    setFilteredDrivers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedState, selectedCity, allDrivers]);

  // Pagination calculations
  const totalDrivers = filteredDrivers.length;
  const totalPages = Math.ceil(totalDrivers / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);

  // Show message if no drivers match the filter
  if (filteredDrivers.length === 0 && (selectedState || selectedCity)) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No drivers found
            </h3>
            <p className="text-gray-500">
              No drivers available in {selectedCity || selectedState}. Try
              selecting a different location.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no drivers for current page (shouldn't happen normally)
  if (filteredDrivers.length > 0 && currentDrivers.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Page not found
            </h3>
            <p className="text-gray-500">
              This page doesn't exist. Please try a different page.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const getCardStyling = (driver: Driver) => {
    if (driver.isPrime) {
      return {
        containerClass: "relative",
        frameClass: "bg-white rounded-3xl border-2 border-gray-200 shadow-2xl",
        backgroundClass: "p-8",
        badgeClass: "",
        badgeText: "VIP Prime",
        hasFloatingBadge: true,
      };
    }
    if (driver.isVIP) {
      return {
        containerClass: "relative",
        frameClass: "bg-white rounded-3xl border-2 border-gray-200 shadow-xl",
        backgroundClass: "p-8",
        badgeClass: "",
        badgeText: "VIP",
        hasFloatingBadge: true,
      };
    }
    return {
      containerClass: "relative",
      frameClass: "bg-white rounded-3xl border-2 border-gray-300 shadow-lg",
      backgroundClass: "p-8",
      badgeClass: "",
      badgeText: "FREE",
      hasFloatingBadge: true,
    };
  };

  const getPremiumBadge = (driver: Driver) => {
    if (driver.isPrime) {
      return (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-4 z-30">
          <div className="relative inline-flex items-center gap-2 px-4 py-2">
            <Crown
              className="h-5 w-5 text-yellow-800"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
            />
            <span
              className="text-yellow-900 font-serif font-bold text-sm uppercase tracking-wider"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}
            >
              VIP Prime
            </span>
          </div>
        </div>
      );
    }

    if (driver.isVIP) {
      return (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-10 z-30">
          <div className="relative inline-flex items-center gap-2 px-4 py-2">
            <Shield
              className="h-5 w-5 text-indigo-800"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
            />
            <span
              className="text-indigo-900 font-serif font-bold text-sm uppercase tracking-wider"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}
            >
              VIP
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute -top-0 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 z-30">
        <div className="relative inline-flex items-center gap-2 px-4 py-2">
          <Star
            className="h-5 w-5 text-gray-800"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          />
          <span
            className="text-gray-900 font-serif font-bold text-sm uppercase tracking-wider"
            style={{ textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}
          >
            FREE
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified Drivers List with Premium Badges */}
        <div className="space-y-6">
          {currentDrivers.map((driver) => {
            const styling = getCardStyling(driver);

            return (
              <div key={driver.id} className={styling.containerClass}>
                {/* Premium Badge */}
                {getPremiumBadge(driver)}

                {/* Main Card with Frame Border */}
                <div
                  className={`block cursor-pointer ${styling.frameClass}`}
                  style={
                    driver.isPrime
                      ? {
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #fefce8 100%)",
                        }
                      : driver.isVIP
                      ? {
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)",
                        }
                      : {
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)",
                        }
                  }
                >
                  <div className={styling.backgroundClass}>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                      {/* Driver Info Section */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8 flex-1">
                        {/* Driver Profile Image with Premium Ring */}
                        <div className="flex-shrink-0 relative">
                          {driver.isPrime && (
                            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-xl blur-sm opacity-30 animate-pulse"></div>
                          )}
                          {driver.isVIP && !driver.isPrime && (
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-xl blur-sm opacity-25"></div>
                          )}
                          {/* Added glow for FREE drivers */}
                          {!driver.isPrime && !driver.isVIP && (
                            <div className="absolute -inset-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 rounded-xl blur-sm opacity-20"></div>
                          )}
                          <img
                            src={driver.profileImage}
                            alt={driver.name}
                            className={`relative w-32 h-32 rounded-xl object-cover shadow-lg ${
                              driver.isPrime
                                ? "ring-4 ring-amber-300"
                                : driver.isVIP
                                ? "ring-4 ring-purple-300"
                                : "ring-4 ring-sky-200" // Updated ring for FREE drivers
                            }`}
                          />
                        </div>

                        {/* Driver Details */}
                        <div className="flex-1 space-y-4 text-center sm:text-left">
                          {/* Title with Premium Styling */}
                          <h3
                            className={`text-2xl font-bold leading-tight ${
                              driver.isPrime
                                ? "text-amber-900 drop-shadow-sm"
                                : driver.isVIP
                                ? "text-purple-900"
                                : "text-gray-900"
                            }`}
                          >
                            {driver.title}
                            {driver.isPrime && (
                              <Crown className="inline ml-2 h-6 w-6 text-amber-600" />
                            )}
                            {driver.isVIP && !driver.isPrime && (
                              <Shield className="inline ml-2 h-5 w-5 text-purple-600" />
                            )}
                          </h3>

                          {/* Premium Description */}
                          <p
                            className={`text-base leading-relaxed ${
                              driver.isPrime
                                ? "text-amber-800"
                                : driver.isVIP
                                ? "text-purple-800"
                                : "text-gray-700"
                            }`}
                          >
                            {driver.name} Is One Of Our Most Reliable Drivers
                            With Over{" "}
                            {driver.isPrime
                              ? "Ten"
                              : driver.isVIP
                              ? "Seven"
                              : "Five"}{" "}
                            Years Of Experience In City And Outstation Travel.
                            Known For{" "}
                            {driver.isPrime
                              ? "His Exceptional Luxury Service"
                              : driver.isVIP
                              ? "His Professional Premium Service"
                              : "His Reliable Service"}
                            , Punctuality, And Safe Driving,{" "}
                            {driver.isPrime
                              ? "He Ensures Every Ride Is Luxurious And Stress-Free"
                              : driver.isVIP
                              ? "He Ensures Every Ride Is Comfortable And Stress-Free"
                              : "He Ensures Every Ride Is Smooth And Stress-Free"}
                            .
                          </p>

                          {/* Location with Premium Accent */}
                          <p
                            className={`text-base font-medium ${
                              driver.isPrime
                                ? "text-amber-700"
                                : driver.isVIP
                                ? "text-purple-700"
                                : "text-gray-600"
                            }`}
                          >
                            📍 {driver.location}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons without hover effects */}
                      <div className="flex flex-col gap-3 min-w-[160px]">
                        <a
                          href={`https://wa.me/${driver.phone.replace(
                            /[^0-9]/g,
                            ""
                          )}?text=Hi%20${encodeURIComponent(
                            driver.name
                          )},%20I%20would%20like%20to%20book%20your%20${
                            driver.isPrime
                              ? "VIP Prime luxury"
                              : driver.isVIP
                              ? "VIP premium"
                              : "FREE"
                          } taxi%20service.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 relative z-10 ${
                            driver.isPrime
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                              : driver.isVIP
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                              : "bg-green-500 text-white shadow-md"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={20} />
                          WhatsApp
                        </a>

                        <a
                          href={`tel:${driver.phone}`}
                          className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 relative z-10 ${
                            driver.isPrime
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                              : driver.isVIP
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                              : "bg-blue-500 text-white shadow-md"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone size={20} />
                          Contact
                        </a>

                        <div
                          className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 cursor-pointer ${
                            driver.isPrime
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                              : driver.isVIP
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                              : "bg-teal-500 text-white shadow-md"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/driver/${driver.id}`);
                          }}
                        >
                          <span>👤</span>
                          View AD
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Info and Controls at Bottom */}
        <div className="text-center mt-8">
          <div className="text-sm text-gray-500 mb-4">
            Showing {startIndex + 1}-{Math.min(endIndex, totalDrivers)} of{" "}
            {totalDrivers} drivers
            {totalPages > 1 && (
              <span className="ml-2">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UnifiedDriverSection;
