import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Car,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
      {
        id: "106",
        name: "Sanjay Sharma",
        rating: 4.3,
        vehicleType: "SUV",
        vehicleModel: "Tata Safari",
        location: "Electronic City, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543225",
        profileImage:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "107",
        name: "Manish Gupta",
        rating: 4.0,
        vehicleType: "Sedan",
        vehicleModel: "Skoda Rapid",
        location: "Powai, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543226",
        profileImage:
          "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "108",
        name: "Arjun Singh",
        rating: 4.4,
        vehicleType: "Hatchback",
        vehicleModel: "Maruti Baleno",
        location: "Karol Bagh, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543227",
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "109",
        name: "Rohit Verma",
        rating: 4.2,
        vehicleType: "SUV",
        vehicleModel: "Mahindra Scorpio",
        location: "HSR Layout, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543228",
        profileImage:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "110",
        name: "Ajay Kumar",
        rating: 4.1,
        vehicleType: "Sedan",
        vehicleModel: "Volkswagen Vento",
        location: "Thane West, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543229",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "111",
        name: "Dinesh Yadav",
        rating: 4.3,
        vehicleType: "Hatchback",
        vehicleModel: "Ford Figo",
        location: "Janakpuri, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543230",
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "112",
        name: "Krishna Prasad",
        rating: 4.0,
        vehicleType: "SUV",
        vehicleModel: "Ford EcoSport",
        location: "Marathahalli, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543231",
        profileImage:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
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
      // Additional Regular drivers
      {
        id: "113",
        name: "Ramesh Choudhary",
        rating: 4.2,
        vehicleType: "Sedan",
        vehicleModel: "Nissan Sunny",
        location: "Malviya Nagar, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543236",
        profileImage:
          "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "114",
        name: "Sunil Mehta",
        rating: 4.1,
        vehicleType: "Hatchback",
        vehicleModel: "Tata Tiago",
        location: "Vastrapur, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543237",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
      },
      {
        id: "115",
        name: "Prakash Nair",
        rating: 4.3,
        vehicleType: "SUV",
        vehicleModel: "Renault Duster",
        location: "Kochi, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543238",
        profileImage:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
        isVIP: false,
        priority: 3,
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

  // Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

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
          "bg-white rounded-3xl border-4 border-orange-400 shadow-lg hover:shadow-xl transition-shadow",
        backgroundClass: "p-8",
        badgeClass: "bg-yellow-400 text-black",
        badgeText: "VIP Prime",
        hasFloatingBadge: true,
      };
    }
    if (driver.isVIP) {
      return {
        containerClass: "relative",
        frameClass:
          "bg-white rounded-3xl border-4 border-purple-400 shadow-lg hover:shadow-xl transition-shadow",
        backgroundClass: "p-8",
        badgeClass: "bg-purple-600 text-white",
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
      badgeText: "",
      hasFloatingBadge: false,
    };
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Available Drivers - Sorted by Priority
          </h2>
          <p className="text-lg text-gray-600">
            VIP Prime → VIP → Regular drivers available for booking. Premium
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

        {/* Unified Drivers List - Exact Mockup Style */}
        <div className="space-y-6">
          {currentDrivers.map((driver) => {
            const styling = getCardStyling(driver);

            return (
              <div key={driver.id} className={styling.containerClass}>
                {/* Main Card with Frame Border */}
                <Link
                  to={`/driver/${driver.id}`}
                  className={`block cursor-pointer ${styling.frameClass}`}
                >
                  {/* Floating Badge - Positioned absolute on the card */}
                  {styling.hasFloatingBadge && (
                    <div className="absolute -top-2 right-8 z-10">
                      <div
                        className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-md ${styling.badgeClass}`}
                      >
                        {styling.badgeText}
                      </div>
                    </div>
                  )}

                  <div className={styling.backgroundClass}>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                      {/* Driver Info Section */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8 flex-1">
                        {/* Driver Profile Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={driver.profileImage}
                            alt={driver.name}
                            className="w-32 h-32 rounded-xl object-cover shadow-md"
                          />
                        </div>

                        {/* Driver Details */}
                        <div className="flex-1 space-y-4 text-center sm:text-left">
                          {/* Name */}
                          <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                            {driver.name}
                          </h3>

                          {/* Experience Description */}
                          <p className="text-gray-700 text-base leading-relaxed">
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
                              ? "His Exceptional Service"
                              : driver.isVIP
                              ? "His Professional Service"
                              : "His Reliable Service"}
                            , Punctuality, And Safe Driving,{" "}
                            {driver.isPrime
                              ? "He Ensures Every Ride Is Luxurious And Stress-Free"
                              : driver.isVIP
                              ? "He Ensures Every Ride Is Comfortable And Stress-Free"
                              : "He Ensures Every Ride Is Smooth And Stress-Free"}
                            .
                          </p>

                          {/* Location */}
                          <p className="text-gray-600 text-base font-medium">
                            {driver.location}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons - Stacked vertically like in mockup */}
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
                              ? "VIP"
                              : ""
                          } taxi%20service.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors relative z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={20} />
                          WhatsApp
                        </a>

                        <a
                          href={`tel:${driver.phone}`}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors relative z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone size={20} />
                          Contact
                        </a>

                        <div className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer">
                          <span>👤</span>
                          View AD
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12">
            <div className="flex items-center justify-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                  </>
                )}

                {/* Current page and surrounding pages */}
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((pageNum) => {
                    return (
                      pageNum === currentPage ||
                      pageNum === currentPage - 1 ||
                      pageNum === currentPage + 1 ||
                      (currentPage <= 2 && pageNum <= 3) ||
                      (currentPage >= totalPages - 1 &&
                        pageNum >= totalPages - 2)
                    );
                  })
                  .map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        pageNum === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Mobile-friendly pagination info */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Page {currentPage} of {totalPages} • {totalDrivers} total drivers
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UnifiedDriverSection;
