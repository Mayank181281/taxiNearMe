import { UserProfile, RegisterData } from "../services/authService";
import { User as FirebaseUser } from "firebase/auth";

// Using UserProfile from authService as our User type
export type User = UserProfile;

export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

export type { RegisterData };
