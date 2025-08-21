import { createContext, useContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "driver" | "prime-driver";
  isPremium?: boolean;
  city?: string;
  state?: string;
  subscriptionEnd?: string;
  // Personal Information
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  // Identification
  aadhaar?: string;
  driverLicense?: string;
  licenseExpiry?: string;
  experience?: string;
  // Vehicle Information
  vehicles?: Array<{
    id: string;
    type: string;
    model: string;
    number: string;
    year: string;
  }>;
  // Legacy vehicle fields (for backward compatibility)
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  // Banking Information
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  // Profile Status
  profileCompleted?: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "driver";
  phone?: string;
  gender?: string;
  [key: string]: unknown;
}

interface StoredUser extends User {
  password: string;
  registrationDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "driver") => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, useAuth };
export type { User, RegisterData, StoredUser, AuthContextType };
