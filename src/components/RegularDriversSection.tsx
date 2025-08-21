import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, Phone, Car, MessageCircle } from "lucide-react";

interface RegularDriver {
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
}

interface RegularDriversSectionProps {
  selectedState?: string;
  selectedCity?: string;
}

const RegularDriversSection: React.FC<RegularDriversSectionProps> = ({
  selectedState,
  selectedCity,
}) => {
  const [filteredDrivers, setFilteredDrivers] = useState<RegularDriver[]>([]);

  // Dummy regular drivers data with state and city information
  const regularDrivers: RegularDriver[] = useMemo(
    () => [
      // Prime Drivers from Carousel (consistent data)
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
      },
      {
        id: "2",
        name: "Priya Sharma",
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
      // Regular Drivers
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
      },
      {
        id: "121",
        name: "Manoj Joshi",
        rating: 4.3,
        vehicleType: "Hatchback",
        vehicleModel: "Maruti Alto",
        location: "Janakpuri, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543250",
        profileImage:
          "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "102",
        name: "Amit Verma",
        rating: 4.3,
        vehicleType: "Hatchback",
        vehicleModel: "Maruti Swift",
        location: "Andheri East, Mumbai",
        state: "Maharashtra",
        city: "Mumbai",
        phone: "+91 9876543221",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "103",
        name: "Deepak Singh",
        rating: 4.4,
        vehicleType: "SUV",
        vehicleModel: "Mahindra XUV500",
        location: "Whitefield, Bangalore",
        state: "Karnataka",
        city: "Bangalore",
        phone: "+91 9876543222",
        profileImage:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "104",
        name: "Ravi Kumar",
        rating: 4.2,
        vehicleType: "Sedan",
        vehicleModel: "Hyundai Verna",
        location: "Jubilee Hills, Hyderabad",
        state: "Telangana",
        city: "Hyderabad",
        phone: "+91 9876543223",
        profileImage:
          "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      // Add another Prime Driver from Carousel
      {
        id: "5",
        name: "Vikram Singh",
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
        id: "105",
        name: "Manoj Tiwari",
        rating: 4.6,
        vehicleType: "Hatchback",
        vehicleModel: "Tata Tiago",
        location: "Salt Lake, Kolkata",
        state: "West Bengal",
        city: "Kolkata",
        phone: "+91 9876543224",
        profileImage:
          "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "106",
        name: "Santosh Yadav",
        rating: 4.3,
        vehicleType: "Sedan",
        vehicleModel: "Toyota Etios",
        location: "Vaishali Nagar, Jaipur",
        state: "Rajasthan",
        city: "Jaipur",
        phone: "+91 9876543225",
        profileImage:
          "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "107",
        name: "Karan Shah",
        rating: 4.4,
        vehicleType: "SUV",
        vehicleModel: "Tata Nexon",
        location: "Borivali West, Mumbai",
        state: "Maharashtra",
        city: "Mumbai",
        phone: "+91 9876543226",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      // Add another Prime Driver from Carousel
      {
        id: "6",
        name: "Arjun Mehta",
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
        id: "108",
        name: "Rajesh Sharma",
        rating: 4.1,
        vehicleType: "Sedan",
        vehicleModel: "Volkswagen Vento",
        location: "Electronic City, Bangalore",
        state: "Karnataka",
        city: "Bangalore",
        phone: "+91 9876543227",
        profileImage:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "109",
        name: "Vinod Agarwal",
        rating: 4.3,
        vehicleType: "Hatchback",
        vehicleModel: "Maruti Baleno",
        location: "T. Nagar, Chennai",
        state: "Tamil Nadu",
        city: "Chennai",
        phone: "+91 9876543228",
        profileImage:
          "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "110",
        name: "Sanjay Mishra",
        rating: 4.5,
        vehicleType: "Sedan",
        vehicleModel: "Honda Amaze",
        location: "Hazratganj, Lucknow",
        state: "Uttar Pradesh",
        city: "Lucknow",
        phone: "+91 9876543229",
        profileImage:
          "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "111",
        name: "Prakash Jain",
        rating: 4.2,
        vehicleType: "SUV",
        vehicleModel: "Mahindra Scorpio",
        location: "Navrangpura, Ahmedabad",
        state: "Gujarat",
        city: "Ahmedabad",
        phone: "+91 9876543230",
        profileImage:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "112",
        name: "Sunil Patil",
        rating: 4.4,
        vehicleType: "Hatchback",
        vehicleModel: "Hyundai i20",
        location: "Kothrud, Pune",
        state: "Maharashtra",
        city: "Pune",
        phone: "+91 9876543231",
        profileImage:
          "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "113",
        name: "Ramesh Reddy",
        rating: 4.0,
        vehicleType: "Sedan",
        vehicleModel: "Ford Aspire",
        location: "Gachibowli, Hyderabad",
        state: "Telangana",
        city: "Hyderabad",
        phone: "+91 9876543232",
        profileImage:
          "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "114",
        name: "Harish Nair",
        rating: 4.6,
        vehicleType: "SUV",
        vehicleModel: "Renault Duster",
        location: "Adyar, Chennai",
        state: "Tamil Nadu",
        city: "Chennai",
        phone: "+91 9876543233",
        profileImage:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "115",
        name: "Ashok Pandey",
        rating: 4.1,
        vehicleType: "Hatchback",
        vehicleModel: "Nissan Micra",
        location: "Malviya Nagar, Jaipur",
        state: "Rajasthan",
        city: "Jaipur",
        phone: "+91 9876543234",
        profileImage:
          "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "116",
        name: "Mukesh Rai",
        rating: 4.7,
        vehicleType: "Sedan",
        vehicleModel: "Skoda Rapid",
        location: "Ballygunge, Kolkata",
        state: "West Bengal",
        city: "Kolkata",
        phone: "+91 9876543235",
        profileImage:
          "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "117",
        name: "Dinesh Kumar",
        rating: 4.3,
        vehicleType: "SUV",
        vehicleModel: "Tata Safari",
        location: "Rajouri Garden, Delhi",
        state: "Delhi",
        city: "Delhi",
        phone: "+91 9876543236",
        profileImage:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "118",
        name: "Gopal Menon",
        rating: 4.2,
        vehicleType: "Hatchback",
        vehicleModel: "Chevrolet Beat",
        location: "Koramangala, Bangalore",
        state: "Karnataka",
        city: "Bangalore",
        phone: "+91 9876543237",
        profileImage:
          "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "119",
        name: "Mohan Lal",
        rating: 4.4,
        vehicleType: "Sedan",
        vehicleModel: "Maruti Dzire",
        location: "Indore City, Indore",
        state: "Madhya Pradesh",
        city: "Indore",
        phone: "+91 9876543238",
        profileImage:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
      {
        id: "120",
        name: "Jagdish Patel",
        rating: 4.0,
        vehicleType: "SUV",
        vehicleModel: "Mahindra Bolero",
        location: "Vastrapur, Ahmedabad",
        state: "Gujarat",
        city: "Ahmedabad",
        phone: "+91 9876543239",
        profileImage:
          "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        isPrime: false,
      },
    ],
    []
  );

  // Filter drivers based on selected state and city
  useEffect(() => {
    let filtered = regularDrivers;

    if (selectedCity && selectedCity !== "all") {
      console.log("RegularDriversSection - selectedCity:", selectedCity);
      console.log(
        "RegularDriversSection - total drivers before filter:",
        filtered.length
      );
      filtered = filtered.filter((driver) => driver.city === selectedCity);
      console.log(
        "RegularDriversSection - drivers after city filter:",
        filtered.length
      );
    } else if (selectedState && selectedState !== "all") {
      filtered = filtered.filter((driver) => driver.state === selectedState);
    }

    setFilteredDrivers(filtered);
  }, [selectedState, selectedCity, regularDrivers]);

  // Show message if no drivers match the filter (but not if no filter is applied)
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

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            * Advertisement never stops, and neither do our taxis. *
          </h2>
          <p className="text-sm text-gray-600">
            Book Your Taxi in Seconds With Our Easy-To-Use Platform, Enjoy Safe
            Rides, Transparent Fare, And Trusted Drivers Across India, Make Your
            Travel 24*7 – Our Journey Matters, Your Happiness Our Priority
          </p>
        </div>

        {/* Drivers List - Mobile-Optimized Responsive Design */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 md:grid-cols-1">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="relative">
              <Link
                to={`/driver/${driver.id}`}
                className="block bg-blue-50 rounded-xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                  {/* Driver Image and Info Section */}
                  <div className="flex flex-col xs:flex-row items-center xs:items-start gap-3 xs:gap-4 flex-1">
                    {/* Driver Profile Image - Centered on mobile */}
                    <div className="flex-shrink-0">
                      <img
                        src={driver.profileImage}
                        alt={driver.name}
                        className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl object-cover shadow-md"
                      />
                    </div>

                    {/* Driver Info - Better mobile spacing */}
                    <div className="flex-1 space-y-1.5 xs:space-y-2 sm:space-y-2.5 text-center xs:text-left w-full">
                      {/* Name and Prime Badge */}
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-start items-center gap-1.5 xs:gap-2">
                        <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                          {driver.name}
                        </h3>
                        {driver.isPrime && (
                          <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold">
                            Prime
                          </span>
                        )}
                      </div>

                      {/* Driver Details - Compact mobile layout */}
                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 xs:gap-1.5 sm:gap-2 text-xs xs:text-sm sm:text-base">
                        <p className="text-gray-700 font-medium">
                          <span className="font-semibold">City:</span>{" "}
                          {driver.city}
                        </p>
                        <p className="text-gray-700 font-medium">
                          <span className="font-semibold">Gender:</span> Male
                        </p>

                        {/* Rating - Special styling */}
                        <div className="flex items-center justify-center xs:justify-start gap-1">
                          <span className="text-gray-700 font-semibold">
                            Rating:
                          </span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 xs:h-4 xs:w-4 text-yellow-500 fill-current" />
                            <span className="text-gray-900 font-bold ml-0.5">
                              {driver.rating}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 font-medium">
                          <span className="font-semibold">Age:</span> 31
                        </p>
                      </div>

                      {/* Experience - Full width on mobile */}
                      <p className="text-xs xs:text-sm sm:text-base text-gray-700 font-medium pt-0.5">
                        <span className="font-semibold">Experience:</span> 5
                        years
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile-first design */}
                  <div className="flex flex-row gap-2 sm:gap-3 lg:flex-col lg:gap-3 justify-center lg:justify-start pt-2 lg:pt-0">
                    <a
                      href={`https://wa.me/${driver.phone.replace(
                        /[^0-9]/g,
                        ""
                      )}?text=Hi%20${encodeURIComponent(
                        driver.name
                      )},%20I%20would%20like%20to%20book%20your%20taxi%20service.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-3 xs:px-4 sm:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs xs:text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5 xs:gap-2 flex-1 xs:flex-none xs:min-w-[100px] sm:min-w-[120px] lg:min-w-[160px] relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${driver.phone}`}
                      className="bg-blue-600 text-white px-3 xs:px-4 sm:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs xs:text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 xs:gap-2 flex-1 xs:flex-none xs:min-w-[100px] sm:min-w-[120px] lg:min-w-[160px] relative z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                      <span>Contact</span>
                    </a>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Load More Drivers
          </button>
        </div>
      </div>
    </section>
  );
};

export default RegularDriversSection;
