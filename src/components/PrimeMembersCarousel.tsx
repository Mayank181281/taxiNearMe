import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

interface PrimeDriver {
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
  isPrime: boolean;
  isVIP?: boolean;
}

interface PrimeMembersCarouselProps {
  selectedState?: string;
  selectedCity?: string;
}

const PrimeMembersCarousel: React.FC<PrimeMembersCarouselProps> = ({
  selectedState,
  selectedCity,
}) => {
  const [filteredDrivers, setFilteredDrivers] = useState<PrimeDriver[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Dummy prime drivers data with state and city information
  const primeDrivers: PrimeDriver[] = useMemo(
    () => [
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
      },
      {
        id: "13",
        name: "Vishal Gupta",
        title: "this is title ad",
        rating: 4.7,
        vehicleType: "Premium SUV",
        vehicleModel: "Mercedes GLC",
        location: "Karol Bagh, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543240",
        profileImage:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "14",
        name: "Ananya Saxena",
        title: "this is title ad",
        rating: 4.8,
        vehicleType: "Electric Sedan",
        vehicleModel: "Tesla Model S",
        location: "Vasant Kunj, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543241",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "15",
        name: "Rohit Malhotra",
        title: "this is title ad",
        rating: 4.6,
        vehicleType: "Luxury Sedan",
        vehicleModel: "Audi A6",
        location: "Dwarka, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543242",
        profileImage:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "16",
        name: "Deepika Sharma",
        title: "this is title ad",
        rating: 4.8,
        vehicleType: "Premium SUV",
        vehicleModel: "Range Rover Evoque",
        location: "Gurgaon, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543243",
        profileImage:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "17",
        name: "Karan Singh",
        title: "this is title ad",
        rating: 4.7,
        vehicleType: "Electric Luxury",
        vehicleModel: "Tesla Model X",
        location: "Saket, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543244",
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "18",
        name: "Priyanka Jain",
        title: "this is title ad",
        rating: 4.9,
        vehicleType: "Luxury Sedan",
        vehicleModel: "Jaguar XF",
        location: "Lajpat Nagar, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543245",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "19",
        name: "Amit Gupta",
        title: "this is title ad",
        rating: 4.5,
        vehicleType: "Premium SUV",
        vehicleModel: "BMW X5",
        location: "Rohini, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543246",
        profileImage:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "20",
        name: "Sonia Kapoor",
        title: "this is title ad",
        rating: 4.8,
        vehicleType: "Electric SUV",
        vehicleModel: "Audi e-tron",
        location: "Janakpuri, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543247",
        profileImage:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "2",
        name: "Priya Sharma",
        title: "this is title ad",
        rating: 4.8,
        vehicleType: "Electric SUV",
        vehicleModel: "Tesla Model Y",
        location: "Bandra West, Mumbai",
        state: "Maharashtra",
        city: "Mumbai",
        phone: "+91 9876543211",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "3",
        name: "Mohammed Ali",
        title: "this is title ad",
        rating: 4.7,
        vehicleType: "Premium SUV",
        vehicleModel: "Toyota Fortuner",
        location: "Koramangala, Bangalore",
        state: "Karnataka",
        city: "Bangalore",
        phone: "+91 9876543212",
        profileImage:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "4",
        name: "Anita Patel",
        title: "this is title ad",
        rating: 4.6,
        vehicleType: "Luxury Sedan",
        vehicleModel: "Mercedes E-Class",
        location: "Hitech City, Hyderabad",
        state: "Telangana",
        city: "Hyderabad",
        phone: "+91 9876543213",
        profileImage:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "5",
        name: "Vikram Singh",
        title: "this is title ad",
        rating: 4.8,
        vehicleType: "Electric Sedan",
        vehicleModel: "Tesla Model 3",
        location: "Park Street, Kolkata",
        state: "West Bengal",
        city: "Kolkata",
        phone: "+91 9876543214",
        profileImage:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "6",
        name: "Arjun Mehta",
        title: "this is title ad",
        rating: 4.5,
        vehicleType: "Luxury SUV",
        vehicleModel: "Audi Q5",
        location: "Powai, Mumbai",
        state: "Maharashtra",
        city: "Mumbai",
        phone: "+91 9876543215",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "7",
        name: "Kavita Joshi",
        title: "this is title ad",
        rating: 4.7,
        vehicleType: "Luxury Sedan",
        vehicleModel: "Audi A4",
        location: "Koregaon Park, Pune",
        state: "Maharashtra",
        city: "Pune",
        phone: "+91 9876543216",
        profileImage:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "8",
        name: "Rahul Gupta",
        title: "this is title ad",
        rating: 4.9,
        vehicleType: "Premium SUV",
        vehicleModel: "BMW X3",
        location: "Anna Nagar, Chennai",
        state: "Tamil Nadu",
        city: "Chennai",
        phone: "+91 9876543217",
        profileImage:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "9",
        name: "Sanjay Malhotra",
        title: "this is title ad",
        rating: 4.6,
        vehicleType: "Electric SUV",
        vehicleModel: "Tata Nexon EV Max",
        location: "Civil Lines, Jaipur",
        state: "Rajasthan",
        city: "Jaipur",
        phone: "+91 9876543218",
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "10",
        name: "Neha Agarwal",
        title: "this is title ad",
        rating: 4.8,
        vehicleType: "Luxury Sedan",
        vehicleModel: "Mercedes C-Class",
        location: "Gomti Nagar, Lucknow",
        state: "Uttar Pradesh",
        city: "Lucknow",
        phone: "+91 9876543219",
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "11",
        name: "Amit Verma",
        title: "this is title ad",
        rating: 4.5,
        vehicleType: "Premium SUV",
        vehicleModel: "Toyota Innova Crysta",
        location: "Satellite, Ahmedabad",
        state: "Gujarat",
        city: "Ahmedabad",
        phone: "+91 9876543220",
        profileImage:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
      {
        id: "12",
        name: "Ravi Shankar",
        title: "this is title ad",
        rating: 4.7,
        vehicleType: "Electric Sedan",
        vehicleModel: "MG ZS EV",
        location: "Banjara Hills, Hyderabad",
        state: "Telangana",
        city: "Hyderabad",
        phone: "+91 9876543221",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: true,
      },
    ],
    []
  );

  // Filter drivers based on selected state and city
  useEffect(() => {
    let filtered = [...primeDrivers];

    if (selectedState) {
      filtered = filtered.filter((driver) => driver.state === selectedState);
    }

    if (selectedCity) {
      console.log("PrimeMembersCarousel - selectedCity:", selectedCity);
      console.log(
        "PrimeMembersCarousel - total drivers before filter:",
        filtered.length
      );
      filtered = filtered.filter((driver) => driver.city === selectedCity);
      console.log(
        "PrimeMembersCarousel - drivers after city filter:",
        filtered.length
      );
    }

    setFilteredDrivers(filtered);
  }, [selectedState, selectedCity, primeDrivers]);

  // Auto-scroll functionality - move one card at a time
  useEffect(() => {
    if (!isAutoScrolling || filteredDrivers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Reset to beginning when we've scrolled through one full set
        if (nextIndex >= filteredDrivers.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 2000); // Move every 2 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling, filteredDrivers.length]);

  // Don't render the component if no drivers match the filter
  if (filteredDrivers.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 max-w-6xl mx-auto px-4">
      {/* Continuous Carousel Container */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out space-x-3"
            style={{
              transform: `translateX(-${currentIndex * (144 + 12)}px)`, // 144px card width + 12px gap
            }}
          >
            {/* Triple the drivers for smooth infinite scroll */}
            {[...filteredDrivers, ...filteredDrivers, ...filteredDrivers].map(
              (driver, globalIndex) => {
                const index = globalIndex % 6; // For color rotation
                // Subtle, professional colors
                const colors = [
                  "bg-slate-600",
                  "bg-gray-600",
                  "bg-zinc-600",
                  "bg-stone-600",
                  "bg-neutral-600",
                  "bg-slate-700",
                ];
                const bgColor = colors[index % colors.length];

                return (
                  <Link
                    key={`${driver.id}-${globalIndex}`}
                    to={`/driver/${driver.id}`}
                    className="w-36 flex-shrink-0"
                  >
                    <div
                      className={`${bgColor} rounded-lg relative text-center text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden h-40`}
                    >
                      {/* Custom Premium Badge for Carousel */}
                      <div className="absolute top-1 left-1 z-10 transform scale-[0.8] origin-top-left">
                        <div className="flex items-center gap-1 text-yellow-900 font-black tracking-wider transition-all duration-300 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 border-2 border-yellow-500 shadow-lg hover:shadow-xl hover:shadow-yellow-400/50 px-2 py-0.5 rounded-full">
                          <Crown
                            className="h-3 w-3 text-yellow-800 filter drop-shadow-sm"
                            strokeWidth={3}
                          />
                          <span className="text-[8px] uppercase font-black">
                            VIP PRIME
                          </span>
                        </div>
                      </div>

                      {/* Profile Image - Rectangular coverage */}
                      <div className="relative h-32">
                        <img
                          src={driver.profileImage}
                          alt={driver.title}
                          className="w-full h-full object-cover object-center"
                        />
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>

                      {/* Title at bottom */}
                      <div className="absolute bottom-1 left-0 right-0 px-1">
                        <h3 className="text-xs font-semibold leading-tight text-white drop-shadow-sm">
                          {driver.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeMembersCarousel;
