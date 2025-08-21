export interface StateData {
  name: string;
  cities: string[];
}

export const statesAndCities: StateData[] = [
  {
    name: "Maharashtra",
    cities: [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Thane",
      "Pimpri-Chinchwad",
      "Nashik",
      "Kalyan-Dombivali",
      "Vasai-Virar",
      "Aurangabad",
      "Navi Mumbai",
      "Solapur",
      "Mira-Bhayandar",
      "Bhiwandi",
      "Amravati",
      "Nanded",
      "Kolhapur",
      "Ulhasnagar",
      "Sangli-Miraj & Kupwad",
      "Malegaon",
      "Jalgaon",
      "Akola",
    ],
  },
  {
    name: "Delhi",
    cities: ["Delhi", "New Delhi"],
  },
  {
    name: "Karnataka",
    cities: [
      "Bangalore",
      "Hubli-Dharwad",
      "Mysore",
      "Gulbarga",
      "Mangalore",
      "Belgaum",
      "Bellary",
    ],
  },
  {
    name: "Tamil Nadu",
    cities: [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Salem",
      "Tirunelveli",
      "Erode",
      "Ambattur",
    ],
  },
  {
    name: "West Bengal",
    cities: [
      "Kolkata",
      "Howrah",
      "Durgapur",
      "Asansol",
      "Siliguri",
      "Maheshtala",
    ],
  },
  {
    name: "Gujarat",
    cities: ["Ahmedabad", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  },
  {
    name: "Rajasthan",
    cities: ["Jaipur", "Jodhpur", "Bikaner", "Ajmer", "Udaipur", "Kota"],
  },
  {
    name: "Uttar Pradesh",
    cities: [
      "Lucknow",
      "Kanpur",
      "Ghaziabad",
      "Agra",
      "Meerut",
      "Varanasi",
      "Allahabad",
      "Bareilly",
      "Moradabad",
      "Saharanpur",
      "Firozabad",
      "Jhansi",
      "Loni",
      "Aligarh",
      "Noida",
      "Faridabad",
    ],
  },
  {
    name: "Andhra Pradesh",
    cities: [
      "Visakhapatnam",
      "Vijayawada",
      "Guntur",
      "Nellore",
      "Warangal",
      "Tirupati",
    ],
  },
  {
    name: "Telangana",
    cities: ["Hyderabad", "Secunderabad", "Warangal"],
  },
  {
    name: "Kerala",
    cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  },
  {
    name: "Madhya Pradesh",
    cities: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Dewas"],
  },
  {
    name: "Punjab",
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  },
  {
    name: "Haryana",
    cities: [
      "Faridabad",
      "Gurgaon",
      "Panipat",
      "Ambala",
      "Yamunanagar",
      "Rohtak",
      "Hisar",
    ],
  },
  {
    name: "Bihar",
    cities: [
      "Patna",
      "Gaya",
      "Bhagalpur",
      "Muzaffarpur",
      "Purnia",
      "Darbhanga",
    ],
  },
  {
    name: "Odisha",
    cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur"],
  },
  {
    name: "Jharkhand",
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  },
  {
    name: "Assam",
    cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
  },
  {
    name: "Chhattisgarh",
    cities: ["Raipur", "Bhilai Nagar", "Bilaspur", "Korba", "Durg"],
  },
  {
    name: "Uttarakhand",
    cities: [
      "Dehradun",
      "Haridwar",
      "Roorkee",
      "Haldwani-cum-Kathgodam",
      "Rudrapur",
    ],
  },
  {
    name: "Jammu and Kashmir",
    cities: ["Srinagar", "Jammu", "Baramulla", "Anantnag"],
  },
  {
    name: "Himachal Pradesh",
    cities: ["Shimla", "Dharamshala", "Solan", "Mandi"],
  },
  {
    name: "Chandigarh",
    cities: ["Chandigarh"],
  },
];

export const getAllStates = (): string[] => {
  return statesAndCities.map((state) => state.name);
};

export const getCitiesByState = (stateName: string): string[] => {
  const state = statesAndCities.find((state) => state.name === stateName);
  return state ? state.cities : [];
};

export const getAllCities = (): string[] => {
  return statesAndCities.flatMap((state) => state.cities);
};
