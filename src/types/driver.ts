export interface Vehicle {
  id: string;
  type: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  image?: string;
  isAvailable: boolean;
  photo?: string; // For form uploads
  number?: string; // Legacy support
}

export interface DriverProfile {
  // Basic Information (collected in Profile form)
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  gender: "Male" | "Female";
  age?: number;
  dateOfBirth?: string;

  // Location Information
  city: string;
  state: string;
  address: string;

  // Professional Information
  driverLicense: string;
  licenseExpiry?: string;
  experience: string; // e.g., "5 years"

  // System Generated/Managed Fields
  rating: number;
  totalRatings: number;
  isVerified: boolean;
  isPremium: boolean;
  joinDate: string;

  // Services & Languages
  languages: string[];
  specialServices: string[];

  // Vehicle Information
  vehicles: Vehicle[];

  // Availability
  availability: {
    status: "online" | "offline" | "busy";
    workingHours: string;
    days: string[];
  };

  // Private Information (not shown in DriverProfile display)
  aadhaar?: string;
  emergencyContact?: string;

  // Legacy fields for backward compatibility
  role?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYear?: string;
}

// Form data structure for Profile component
export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  aadhaar: string;
  vehicleNumber: string;
  city: string;
  state: string;
  address: string;
  dateOfBirth: string;
  emergencyContact: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleYear: string;
  driverLicense: string;
  licenseExpiry: string;
  experience: string;
  profileImage: string;
  workingHours: string;
  workingDays: string[];
  availabilityStatus: "online" | "offline" | "busy";
}

// Firebase/API response format
export interface DriverApiResponse {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
    gender: "Male" | "Female";
    age?: number;
    dateOfBirth?: string;
  };
  location: {
    city: string;
    state: string;
    address: string;
  };
  professional: {
    driverLicense: string;
    licenseExpiry?: string;
    experience: string;
    rating: number;
    totalRatings: number;
    isVerified: boolean;
    isPremium: boolean;
    joinDate: string;
  };
  services: {
    languages: string[];
    specialServices: string[];
  };
  vehicles: Vehicle[];
  availability: {
    status: "online" | "offline" | "busy";
    workingHours: string;
    days: string[];
  };
  privateInfo: {
    aadhaar?: string;
    emergencyContact?: string;
  };
}
