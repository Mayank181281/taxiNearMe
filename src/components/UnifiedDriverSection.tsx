import React, { useState, useEffect, useMemo } from "react";
import { Phone, Car, MessageCircle, Crown, Star, Shield } from "lucide-react";

interface Driver {
  id: string;
  name: string;
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
        frameClass:
          "bg-white rounded-3xl border-4 border-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]",
        backgroundClass: "p-8",
        badgeClass: "",
        badgeText: "VIP Prime",
        hasFloatingBadge: true,
      };
    }
    if (driver.isVIP) {
      return {
        containerClass: "relative",
        frameClass:
          "bg-white rounded-3xl border-4 border-gradient-to-r from-purple-400 via-purple-500 to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]",
        backgroundClass: "p-8",
        badgeClass: "",
        badgeText: "VIP",
        hasFloatingBadge: true,
      };
    }
    return {
      containerClass: "relative",
      frameClass:
        "bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow",
      backgroundClass: "p-6",
      badgeClass: "",
      badgeText: "Standard",
      hasFloatingBadge: true,
    };
  };

  const getPremiumBadge = (driver: Driver) => {
    if (driver.isPrime) {
      return (
        <div className="absolute -top-3 -right-3 z-20">
          <div className="relative">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-2xl blur-sm opacity-75 animate-pulse"></div>

            {/* Main badge */}
            <div className="relative bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 px-6 py-3 rounded-2xl shadow-2xl border-2 border-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
              {/* Inner shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-2xl"></div>

              {/* Badge content */}
              <div className="relative flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-800 drop-shadow-sm" />
                <span className="text-amber-900 font-bold text-sm tracking-wide drop-shadow-sm">
                  VIP PRIME
                </span>
                <div className="flex">
                  <Star className="h-3 w-3 text-amber-800 fill-current" />
                  <Star className="h-3 w-3 text-amber-800 fill-current" />
                  <Star className="h-3 w-3 text-amber-800 fill-current" />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
              <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-amber-200 rounded-full opacity-80"></div>
            </div>
          </div>
        </div>
      );
    }

    if (driver.isVIP) {
      return (
        <div className="absolute -top-3 -right-3 z-20">
          <div className="relative">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 rounded-xl blur-sm opacity-60"></div>

            {/* Main badge */}
            <div className="relative bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 rounded-xl shadow-xl border-2 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              {/* Inner shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl"></div>

              {/* Badge content */}
              <div className="relative flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-200 drop-shadow-sm" />
                <span className="text-white font-bold text-sm tracking-wide drop-shadow-sm">
                  VIP
                </span>
                <div className="flex">
                  <Star className="h-3 w-3 text-purple-200 fill-current" />
                  <Star className="h-3 w-3 text-purple-200 fill-current" />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
              <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute -top-2 -right-2 z-20">
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-2 rounded-lg shadow-md border border-gray-300">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-gray-200 fill-current" />
            <span className="text-white font-medium text-xs tracking-wide">
              STANDARD
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Available Drivers - Sorted by Priority
          </h2>
          <p className="text-lg text-gray-600">
            VIP Prime → VIP → Standard drivers available for booking. Premium
            service guaranteed across India
          </p>
          {/* Pagination Info */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, totalDrivers)} of{" "}
            {totalDrivers} drivers
            {totalPages > 1 && (
              <span className="ml-2">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </div>
        </div>

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
                          borderImage:
                            "linear-gradient(145deg, #f59e0b, #eab308, #f59e0b) 1",
                        }
                      : driver.isVIP
                      ? {
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)",
                          borderImage:
                            "linear-gradient(145deg, #8b5cf6, #a855f7, #8b5cf6) 1",
                        }
                      : {}
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
                          <img
                            src={driver.profileImage}
                            alt={driver.name}
                            className={`relative w-32 h-32 rounded-xl object-cover shadow-lg ${
                              driver.isPrime
                                ? "ring-4 ring-amber-300"
                                : driver.isVIP
                                ? "ring-4 ring-purple-300"
                                : "ring-2 ring-gray-200"
                            }`}
                          />
                        </div>

                        {/* Driver Details */}
                        <div className="flex-1 space-y-4 text-center sm:text-left">
                          {/* Name with Premium Styling */}
                          <h3
                            className={`text-2xl font-bold leading-tight ${
                              driver.isPrime
                                ? "text-amber-900 drop-shadow-sm"
                                : driver.isVIP
                                ? "text-purple-900"
                                : "text-gray-900"
                            }`}
                          >
                            {driver.name}
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

                          {/* Rating with Premium Stars */}
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.floor(driver.rating)
                                      ? driver.isPrime
                                        ? "text-amber-500 fill-current"
                                        : driver.isVIP
                                        ? "text-purple-500 fill-current"
                                        : "text-yellow-500 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span
                              className={`font-semibold ${
                                driver.isPrime
                                  ? "text-amber-700"
                                  : driver.isVIP
                                  ? "text-purple-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {driver.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons with Premium Styling */}
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
                              : "standard"
                          } taxi%20service.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 relative z-10 transform hover:scale-105 ${
                            driver.isPrime
                              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                              : driver.isVIP
                              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg"
                              : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={20} />
                          WhatsApp
                        </a>

                        <a
                          href={`tel:${driver.phone}`}
                          className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 relative z-10 transform hover:scale-105 ${
                            driver.isPrime
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                              : driver.isVIP
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                              : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone size={20} />
                          Contact
                        </a>

                        <div
                          className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                            driver.isPrime
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                              : driver.isVIP
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg"
                              : "bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg"
                          }`}
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
      </div>
    </section>
  );
};

export default UnifiedDriverSection;
