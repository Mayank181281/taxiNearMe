export interface StateData {
  name: string;
  cities: string[];
}

export const statesAndCities: StateData[] = [
  {
    name: "Andhra Pradesh",
    cities: [
      "Guntur",
      "Nellore",
      "Tirupati",
      "Vijayawada",
      "Visakhapatnam",
      "Warangal",
    ],
  },
  {
    name: "Assam",
    cities: ["Dibrugarh", "Guwahati", "Jorhat", "Nagaon", "Silchar"],
  },
  {
    name: "Bihar",
    cities: [
      "Bhagalpur",
      "Darbhanga",
      "Gaya",
      "Muzaffarpur",
      "Patna",
      "Purnia",
    ],
  },
  {
    name: "Chandigarh",
    cities: ["Chandigarh"],
  },
  {
    name: "Chhattisgarh",
    cities: ["Bhilai Nagar", "Bilaspur", "Durg", "Korba", "Raipur"],
  },
  {
    name: "Delhi",
    cities: ["Delhi", "New Delhi"],
  },
  {
    name: "Gujarat",
    cities: ["Ahmedabad", "Bhavnagar", "Jamnagar", "Rajkot", "Vadodara"],
  },
  {
    name: "Haryana",
    cities: [
      "Ambala",
      "Faridabad",
      "Gurgaon",
      "Hisar",
      "Panipat",
      "Rohtak",
      "Yamunanagar",
    ],
  },
  {
    name: "Himachal Pradesh",
    cities: ["Dharamshala", "Mandi", "Shimla", "Solan"],
  },
  {
    name: "Jammu and Kashmir",
    cities: ["Anantnag", "Baramulla", "Jammu", "Srinagar"],
  },
  {
    name: "Jharkhand",
    cities: ["Bokaro", "Deoghar", "Dhanbad", "Jamshedpur", "Ranchi"],
  },
  {
    name: "Karnataka",
    cities: [
      "Bangalore",
      "Belgaum",
      "Bellary",
      "Gulbarga",
      "Hubli-Dharwad",
      "Mangalore",
      "Mysore",
    ],
  },
  {
    name: "Kerala",
    cities: ["Kochi", "Kollam", "Kozhikode", "Thiruvananthapuram", "Thrissur"],
  },
  {
    name: "Madhya Pradesh",
    cities: ["Bhopal", "Dewas", "Gwalior", "Indore", "Jabalpur", "Ujjain"],
  },
  {
    name: "Maharashtra",
    cities: [
      "Akola",
      "Amravati",
      "Aurangabad",
      "Bhiwandi",
      "Jalgaon",
      "Kalyan-Dombivali",
      "Kolhapur",
      "Malegaon",
      "Mira-Bhayandar",
      "Mumbai",
      "Nagpur",
      "Nanded",
      "Nashik",
      "Navi Mumbai",
      "Pimpri-Chinchwad",
      "Pune",
      "Sangli-Miraj",
      "Solapur",
      "Thane",
      "Ulhasnagar",
      "Vasai-Virar",
    ],
  },
  {
    name: "Odisha",
    cities: ["Bhubaneswar", "Brahmapur", "Cuttack", "Rourkela", "Sambalpur"],
  },
  {
    name: "Punjab",
    cities: ["Amritsar", "Bathinda", "Jalandhar", "Ludhiana", "Patiala"],
  },
  {
    name: "Rajasthan",
    cities: ["Ajmer", "Bikaner", "Jaipur", "Jodhpur", "Kota", "Udaipur"],
  },
  {
    name: "Tamil Nadu",
    cities: [
      "Ambattur",
      "Chennai",
      "Coimbatore",
      "Erode",
      "Madurai",
      "Salem",
      "Tiruchirappalli",
      "Tirunelveli",
    ],
  },
  {
    name: "Telangana",
    cities: ["Hyderabad", "Secunderabad", "Warangal"],
  },
  {
    name: "Uttar Pradesh",
    cities: [
      "Agra",
      "Aligarh",
      "Allahabad",
      "Bareilly",
      "Faridabad",
      "Firozabad",
      "Ghaziabad",
      "Jhansi",
      "Kanpur",
      "Loni",
      "Lucknow",
      "Meerut",
      "Moradabad",
      "Noida",
      "Saharanpur",
      "Varanasi",
    ],
  },
  {
    name: "Uttarakhand",
    cities: [
      "Dehradun",
      "Haldwani-cum-Kathgodam",
      "Haridwar",
      "Roorkee",
      "Rudrapur",
    ],
  },
  {
    name: "West Bengal",
    cities: [
      "Asansol",
      "Durgapur",
      "Howrah",
      "Kolkata",
      "Maheshtala",
      "Siliguri",
    ],
  },
];

export const getAllStates = (): string[] => {
  return statesAndCities.map((state) => state.name).sort();
};

export const getCitiesByState = (stateName: string): string[] => {
  const state = statesAndCities.find((state) => state.name === stateName);
  return state ? state.cities.sort() : [];
};

export const getAllCities = (): string[] => {
  return statesAndCities.flatMap((state) => state.cities).sort();
};

export const categories = ["Taxi", "Tour and Travels"];

export const getCategories = (): string[] => {
  return categories;
};
