import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext, User, RegisterData, StoredUser } from "./auth";

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
      role: "driver",
      isPremium: true,
      city: "Delhi",
      phone: "+91 9876543210",
      gender: "male",
      aadhaar: "123456789012",
      vehicleNumber: "DL01AB1234",
      vehicleType: "Sedan",
      vehicleModel: "Honda City",
      vehicleYear: "2020",
      driverLicense: "DL123456789",
      registrationDate: new Date().toISOString(),
      subscriptionEnd: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      profileCompleted: false,
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

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "driver"
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const users: StoredUser[] = JSON.parse(
        localStorage.getItem("drivers") || "[]"
      );
      const foundUser = users.find(
        (u: StoredUser) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role || role,
          isPremium: foundUser.isPremium,
          city: foundUser.city,
          subscriptionEnd: foundUser.subscriptionEnd,
          // Personal Information
          phone: foundUser.phone,
          gender: foundUser.gender,
          dateOfBirth: foundUser.dateOfBirth,
          address: foundUser.address,
          emergencyContact: foundUser.emergencyContact,
          // Identification
          aadhaar: foundUser.aadhaar,
          driverLicense: foundUser.driverLicense,
          licenseExpiry: foundUser.licenseExpiry,
          experience: foundUser.experience,
          // Vehicle Information
          vehicleNumber: foundUser.vehicleNumber,
          vehicleType: foundUser.vehicleType,
          vehicleModel: foundUser.vehicleModel,
          vehicleYear: foundUser.vehicleYear,
          // Banking Information
          bankName: foundUser.bankName,
          bankAccount: foundUser.bankAccount,
          ifscCode: foundUser.ifscCode,
          // Profile Status
          profileCompleted: foundUser.profileCompleted,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    try {
      const existingUsers: StoredUser[] = JSON.parse(
        localStorage.getItem("drivers") || "[]"
      );

      const newUser: StoredUser = {
        ...userData,
        id: Date.now().toString(),
        registrationDate: new Date().toISOString(),
      } as StoredUser;

      existingUsers.push(newUser);
      localStorage.setItem("drivers", JSON.stringify(existingUsers));

      setIsLoading(false);
      return true;
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
export default AuthProvider;
