import React, {
  useState,
  useEffect,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { registerUser, loginUser, logoutUser } from "../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface StoredUser extends User {
  password: string;
  registrationDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize mock data for development/testing
  const initializeMockData = () => {
    // Demo driver data
    const demoDriver: StoredUser = {
      id: "demo-driver-1",
      name: "John Driver",
      email: "driver@demo.com",
      password: "password123",
      phone: "+91 9876543210",
      registrationDate: new Date().toISOString(),
    };

    // Initialize drivers in localStorage if not exists
    const existingDrivers: StoredUser[] = JSON.parse(
      localStorage.getItem("drivers") || "[]"
    );
    if (
      !existingDrivers.some((d: StoredUser) => d.email === demoDriver.email)
    ) {
      existingDrivers.push(demoDriver);
      localStorage.setItem("drivers", JSON.stringify(existingDrivers));
    }
  };

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        // User is signed in and email is verified
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              id: firebaseUser.uid,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
            };
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // User is signed out or email not verified
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          // Check if we have a stored demo user (for backward compatibility)
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email === "driver@demo.com") {
            setUser(parsedUser);
          } else {
            setUser(null);
            localStorage.removeItem("user");
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const result = await loginUser(email, password);
      
      if (result.success && result.user) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const user: User = {
            id: result.user.uid,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
          };
          
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        }
        
        setIsLoading(false);
        return true;
      } else if (result.error) {
        // Throw error to be caught by login components
        setIsLoading(false);
        throw new Error(result.error);
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw error; // Re-throw to be handled by login components
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Transform RegisterData to match UserData requirements
      const userDataForFirebase = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      };

      const result = await registerUser(userDataForFirebase);
      
      if (result.success) {
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;

    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));

    // Also update in the drivers storage array
    const users: StoredUser[] = JSON.parse(
      localStorage.getItem("drivers") || "[]"
    );
    const userIndex = users.findIndex((u: StoredUser) => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem("drivers", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updateUser, isLoading }}
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
export type { User, RegisterData, StoredUser, AuthContextType };
