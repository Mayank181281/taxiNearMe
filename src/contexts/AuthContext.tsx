import React, {
  useState,
  useEffect,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../config/firebase";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  getUserProfile,
  UserProfile,
  RegisterData,
} from "../services/authService";

// Using UserProfile from authService as our User type
type User = UserProfile;

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (firebaseUser && firebaseUser.emailVerified) {
        // User is signed in and email is verified
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
            setFirebaseUser(firebaseUser);
          } else {
            // Profile not found, sign out
            await logoutUser();
            setUser(null);
            setFirebaseUser(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
          setFirebaseUser(null);
        }
      } else {
        // User is signed out or email not verified
        setUser(null);
        setFirebaseUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success && result.userProfile) {
        setUser(result.userProfile);
        setFirebaseUser(result.user!);
      }

      setIsLoading(false);
      return result;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
    setIsLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);

    try {
      const result = await registerUser(userData);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const updateUser = async (updatedData: Partial<User>): Promise<boolean> => {
    if (!user || !firebaseUser) return false;

    try {
      const success = await updateUserProfile(firebaseUser.uid, updatedData);
      if (success) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error("Update user error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        logout,
        register,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
export { useAuth };
export type { User, RegisterData, AuthContextType };
