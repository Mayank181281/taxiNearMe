import React from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";

interface SimilarDriver {
  id: string;
  name: string;
  rating: number;
  vehicleType: string;
  vehicleModel: string;
  location: string;
  phone: string;
  profileImage: string;
  isPrime?: boolean;
  isVIP?: boolean;
}

interface SimilarProfilesProps {
  currentDriverId: string;
  city: string;
}

const SimilarProfiles: React.FC<SimilarProfilesProps> = ({
  currentDriverId,
  city,
}) => {
  // Mock data - in real app, this would come from an API
  const allDrivers: SimilarDriver[] = [
    // VIP PRIME DRIVERS
    {
      id: "1",
      name: "Rajesh Kumar",
      rating: 4.9,
      vehicleType: "Luxury Sedan",
      vehicleModel: "BMW 3 Series",
      location: "Connaught Place, Delhi",
      phone: "+91 9876543210",
      profileImage:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: true,
      isVIP: false,
    },
    {
      id: "2",
      name: "Priya Sharma",
      rating: 4.8,
      vehicleType: "Electric SUV",
      vehicleModel: "Tesla Model Y",
      location: "Karol Bagh, Delhi",
      phone: "+91 9876543211",
      profileImage:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: true,
      isVIP: false,
    },
    {
      id: "3",
      name: "Mohammed Ali",
      rating: 4.7,
      vehicleType: "Premium SUV",
      vehicleModel: "Toyota Fortuner",
      location: "Lajpat Nagar, Delhi",
      phone: "+91 9876543212",
      profileImage:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: true,
      isVIP: false,
    },
    {
      id: "4",
      name: "Kavita Singh",
      rating: 4.9,
      vehicleType: "Luxury Sedan",
      vehicleModel: "Mercedes C-Class",
      location: "Janpath, Delhi",
      phone: "+91 9876543213",
      profileImage:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: true,
      isVIP: false,
    },
    {
      id: "5",
      name: "Ravi Kumar",
      rating: 4.8,
      vehicleType: "Premium SUV",
      vehicleModel: "Hyundai Creta",
      location: "Dwarka, Delhi",
      phone: "+91 9876543214",
      profileImage:
        "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: true,
      isVIP: false,
    },

    // VIP DRIVERS
    {
      id: "201",
      name: "Mahesh Varma",
      rating: 4.7,
      vehicleType: "Premium Sedan",
      vehicleModel: "Toyota Camry",
      location: "CP, Delhi",
      phone: "+91 9876543301",
      profileImage:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: false,
      isVIP: true,
    },
    {
      id: "202",
      name: "Sunita Devi",
      rating: 4.6,
      vehicleType: "Premium SUV",
      vehicleModel: "Honda CR-V",
      location: "Paharganj, Delhi",
      phone: "+91 9876543302",
      profileImage:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: false,
      isVIP: true,
    },

    // REGULAR DRIVERS
    {
      id: "101",
      name: "Suresh Gupta",
      rating: 4.4,
      vehicleType: "Sedan",
      vehicleModel: "Maruti Dzire",
      location: "Rohini, Delhi",
      phone: "+91 9876543401",
      profileImage:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: false,
      isVIP: false,
    },
    {
      id: "102",
      name: "Anjali Kumari",
      rating: 4.3,
      vehicleType: "Hatchback",
      vehicleModel: "Hyundai i20",
      location: "Saket, Delhi",
      phone: "+91 9876543402",
      profileImage:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      isPrime: false,
      isVIP: false,
    },
  ];

  // Filter drivers by city and exclude current driver - only show Prime drivers
  const similarDrivers = allDrivers
    .filter(
      (driver) =>
        driver.id !== currentDriverId &&
        driver.location.includes(city) &&
        driver.isPrime === true
    )
    .slice(0, 2); // Only show 2 prime drivers

  if (similarDrivers.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Similar Listing</h2>
      </div>

      {/* Driver Cards - 2 Cards Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {similarDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex"
          >
            {/* Driver Photo with Badge - Left Side */}
            <div className="relative w-32 flex-shrink-0">
              <img
                src={driver.profileImage}
                alt={driver.name}
                className="w-full h-full object-cover"
              />

              {/* VIP Prime Badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                  VIP Prime
                </span>
              </div>

              {/* Name Badge at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="p-2">
                  <h3 className="text-white font-semibold text-xs truncate">
                    {driver.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Driver Description - Right Side */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div className="mb-3">
                <p className="text-xs text-gray-700 leading-relaxed">
                  {driver.name} is One Of Our Most Reliable Drivers With Over
                  Seven Years Of Experience In City.{driver.name} is One Of Our
                  Most Reliable Drivers With Over.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                <a
                  href={`https://wa.me/${driver.phone.replace(
                    /[^0-9]/g,
                    ""
                  )}?text=Hi%20${encodeURIComponent(
                    driver.name
                  )},%20I%20would%20like%20to%20book%20your%20taxi%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white p-1.5 rounded-md hover:bg-green-600 transition-colors flex-1 flex items-center justify-center"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3 w-3" />
                </a>

                <a
                  href={`tel:${driver.phone}`}
                  className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600 transition-colors flex-1 flex items-center justify-center"
                  title="Call"
                >
                  <Phone className="h-3 w-3" />
                </a>

                <Link
                  to={`/driver/${driver.id}`}
                  className="bg-teal-500 text-white p-1.5 rounded-md hover:bg-teal-600 transition-colors flex-1 flex items-center justify-center"
                  title="View Profile"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProfiles;
