import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import SimilarProfiles from "../components/SimilarProfiles";

interface Vehicle {
  id: string;
  type: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  image: string;
  isAvailable: boolean;
}

interface DriverDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  city: string;
  state: string;
  address: string;
  licenseNumber: string;
  specialServices: string[];
  vehicles: Vehicle[];
  availability: {
    status: "online" | "offline" | "busy";
    days: string[];
  };
  // Remove system fields: rating, totalRatings, isVerified, isPremium, joinDate
  // These will be determined by business logic or role
  role?: string; // Keep role for premium determination
}

const DriverProfile: React.FC = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // Mock driver profiles data - in real app, fetch from API based on driverId
  const driverProfiles: { [key: string]: DriverDetail } = {
    "1": {
      id: "1",
      name: "Rajesh Kumar Sharma",
      email: "rajesh.kumar@taxibook.com",
      phone: "+91 9876543210",
      profileImage:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      city: "Delhi",
      state: "Delhi",
      address: "Delhi, Delhi",
      role: "prime-driver", // Used to determine premium status
      licenseNumber: "DL-1420110012345",
      specialServices: [
        "Airport Transfer",
        "Wedding Services",
        "City Tours",
        "Night Service",
      ],
      vehicles: [
        {
          id: "v1",
          type: "Luxury Sedan",
          model: "BMW 3 Series",
          year: 2022,
          color: "Black",
          plateNumber: "DL-01-AB-1234",
          image:
            "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
          isAvailable: true,
        },
        {
          id: "v2",
          type: "SUV",
          model: "Toyota Fortuner",
          year: 2021,
          color: "White",
          plateNumber: "DL-01-CD-5678",
          image:
            "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
          isAvailable: true,
        },
        {
          id: "v3",
          type: "Hatchback",
          model: "Maruti Swift",
          year: 2020,
          color: "Red",
          plateNumber: "DL-01-EF-9012",
          image:
            "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
          isAvailable: false,
        },
      ],
      availability: {
        status: "online",
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    },
    "2": {
      id: "2",
      name: "Priya Singh",
      email: "priya.singh@taxibook.com",
      phone: "+91 9876543211",
      profileImage:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Mumbai, Maharashtra",
      role: "prime-driver",
      licenseNumber: "MH-1220110067890",
      specialServices: [
        "Airport Transfer",
        "Business Trips",
        "Shopping Tours",
        "Women's Safety Service",
      ],
      vehicles: [
        {
          id: "v4",
          type: "Sedan",
          model: "Honda City",
          year: 2023,
          color: "White",
          plateNumber: "MH-01-XY-7890",
          image:
            "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
          isAvailable: true,
        },
        {
          id: "v5",
          type: "Hatchback",
          model: "Hyundai i20",
          year: 2022,
          color: "Blue",
          plateNumber: "MH-01-BC-4567",
          image:
            "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
          isAvailable: true,
        },
      ],
      availability: {
        status: "online",
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
    },
    "3": {
      id: "3",
      name: "Amit Patel",
      email: "amit.patel@taxibook.com",
      phone: "+91 9876543212",
      profileImage:
        "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      city: "Ahmedabad",
      state: "Gujarat",
      address: "Ahmedabad, Gujarat",
      role: "regular-driver",
      licenseNumber: "GJ-0520110098765",
      specialServices: ["City Tours", "Local Transport", "Market Visits"],
      vehicles: [
        {
          id: "v6",
          type: "Auto Rickshaw",
          model: "Bajaj RE",
          year: 2021,
          color: "Yellow",
          plateNumber: "GJ-05-AB-1234",
          image:
            "https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
          isAvailable: true,
        },
      ],
      availability: {
        status: "online",
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    },
    "4": {
      id: "4",
      name: "Suresh Kumar",
      email: "suresh.kumar@taxibook.com",
      phone: "+91 9876543213",
      profileImage:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      city: "Jaipur",
      state: "Rajasthan",
      address: "Jaipur, Rajasthan",
      role: "regular-driver",
      licenseNumber: "RJ-1420110045678",
      specialServices: [
        "Tourist Services",
        "Local Sightseeing",
        "Heritage Tours",
      ],
      vehicles: [
        {
          id: "v7",
          type: "Sedan",
          model: "Maruti Dzire",
          year: 2020,
          color: "Silver",
          plateNumber: "RJ-14-CD-5678",
          image:
            "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
          isAvailable: true,
        },
      ],
      availability: {
        status: "online",
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
    },
    "5": {
      id: "5",
      name: "Kavita Sharma",
      email: "kavita.sharma@taxibook.com",
      phone: "+91 9876543214",
      profileImage:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      city: "Pune",
      state: "Maharashtra",
      address: "Pune, Maharashtra",
      role: "prime-driver",
      licenseNumber: "MH-1220110088899",
      specialServices: [
        "Women's Safety Service",
        "Airport Transfer",
        "Corporate Travel",
        "Medical Assistance",
      ],
      vehicles: [
        {
          id: "v8",
          type: "Sedan",
          model: "Hyundai Verna",
          year: 2023,
          color: "White Pearl",
          plateNumber: "MH-12-EF-9999",
          image:
            "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
          isAvailable: true,
        },
      ],
      availability: {
        status: "online",
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
    },
  };

  // Get driver data or default to first driver
  const driver = driverProfiles[driverId || "1"] || driverProfiles["1"];

  // Helper functions to simulate system-generated data
  const isPremiumDriver = () => driver.role === "prime-driver";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 sm:mb-6 flex items-center text-sm sm:text-base"
        >
          ← Back to Drivers
        </button>

        {/* Driver Profile Card - Responsive Layout */}
        <div className="bg-blue-50 rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            {/* Driver Photo */}
            <div className="flex-shrink-0 self-center lg:self-start">
              <img
                src={driver.profileImage}
                alt={driver.name}
                className="w-24 h-32 xs:w-32 xs:h-40 sm:w-36 sm:h-44 lg:w-40 lg:h-48 rounded-lg object-cover shadow-md"
              />
            </div>

            {/* Driver Info - Responsive layout */}
            <div className="flex-1 space-y-3 sm:space-y-4 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-2 sm:gap-4">
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-900">
                  {driver.name}
                </h1>
                {isPremiumDriver() && (
                  <span className="bg-yellow-400 text-yellow-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold self-center">
                    Prime
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {driver.name} is one of our most reliable drivers with extensive
                experience in the city and outstanding travel service. Known for
                polite behavior, punctuality, and safe driving, ensuring every
                ride is smooth and stress-free. Whether it's a quick trip to the
                airport or a late-night pickup, {driver.name} is always ready to
                serve with a smile.
              </p>

              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {driver.city}, {driver.state}
              </p>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-row sm:flex-col gap-3 justify-center lg:justify-start">
              <a
                href={`https://wa.me/${driver.phone.replace(
                  /[^0-9]/g,
                  ""
                )}?text=Hi%20${encodeURIComponent(
                  driver.name
                )},%20I%20would%20like%20to%20book%20your%20taxi%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-none"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${driver.phone}`}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-none"
              >
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Vehicles Section - Responsive Grid */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-4 sm:mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Photos
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-4 gap-3">
              {driver.vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={vehicle.image}
                    alt={`Vehicle ${vehicle.id}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Info Section - Responsive Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Profile Info
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                Name:
              </div>
              <div className="text-gray-700 text-sm sm:text-base break-words">
                {driver.name}
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-white">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                Email:
              </div>
              <div className="text-gray-700 text-sm sm:text-base break-words">
                {driver.email}
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                Phone:
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                <a
                  href={`tel:${driver.phone}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {driver.phone}
                </a>
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-white">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                Category:
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                {isPremiumDriver() ? "Vip Prime" : "Regular"}
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                State:
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                {driver.state}
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-white">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                City:
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                {driver.city}
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                Address:
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                Address Information
              </div>
            </div>
          </div>
        </div>

        {/* Similar Profiles Section */}
        <div className="mt-6 sm:mt-8">
          <SimilarProfiles currentDriverId={driver.id} city={driver.city} />
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
