import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Advertisement {
  id: string;
  email: string;
  title: string;
  category: string;
  description: string;
  state: string;
  city: string;
  phone: string;
  whatsapp: string;
  image: string | null;
  status: "vip-prime" | "vip" | "published" | "waiting-approval" | "inactive";
  adType: "VIP Prime" | "VIP" | "Normal";
  location: string;
  createdAt: string;
  updatedAt: string;
}

interface AdsContextType {
  ads: Advertisement[];
  addAd: (
    ad: Omit<
      Advertisement,
      "id" | "status" | "adType" | "location" | "createdAt" | "updatedAt"
    >
  ) => void;
  updateAd: (id: string, ad: Partial<Advertisement>) => void;
  getAdById: (id: string) => Advertisement | undefined;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export const useAds = () => {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error("useAds must be used within an AdsProvider");
  }
  return context;
};

export const AdsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ads, setAds] = useState<Advertisement[]>([
    {
      id: "1",
      email: "driver1@example.com",
      title: "Premium Taxi Service - Delhi to Gurgaon",
      category: "Taxi Driver",
      description:
        "Professional taxi service with experienced driver. Clean car, on-time service, and comfortable journey guaranteed.",
      state: "Delhi",
      city: "Central Delhi",
      phone: "+91 9876543210",
      whatsapp: "+91 9876543210",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      status: "vip-prime",
      adType: "VIP Prime",
      location: "Central Delhi, Delhi",
      createdAt: "2025-08-20",
      updatedAt: "2025-08-20",
    },
    {
      id: "2",
      email: "driver2@example.com",
      title: "Comfortable Car Rental Service",
      category: "Car Rental",
      description:
        "Reliable car rental service for all your travel needs. Well-maintained vehicles with professional drivers.",
      state: "Maharashtra",
      city: "Mumbai",
      phone: "+91 8765432109",
      whatsapp: "+91 8765432109",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      status: "vip",
      adType: "VIP",
      location: "Mumbai, Maharashtra",
      createdAt: "2025-08-21",
      updatedAt: "2025-08-21",
    },
    {
      id: "3",
      email: "driver3@example.com",
      title: "Local Taxi Service - City Tours",
      category: "Taxi Driver",
      description:
        "Affordable local taxi service for city tours and short distance travels. Friendly driver and clean vehicle.",
      state: "Karnataka",
      city: "Bangalore",
      phone: "+91 7654321098",
      whatsapp: "+91 7654321098",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      status: "published",
      adType: "Normal",
      location: "Bangalore, Karnataka",
      createdAt: "2025-08-22",
      updatedAt: "2025-08-22",
    },
    {
      id: "4",
      email: "driver4@example.com",
      title: "Airport Transfer Service",
      category: "Taxi Driver",
      description:
        "Dedicated airport transfer service. 24/7 availability with advance booking. Clean cars and punctual service.",
      state: "Delhi",
      city: "Gurgaon",
      phone: "+91 6543210987",
      whatsapp: "+91 6543210987",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      status: "waiting-approval",
      adType: "Normal",
      location: "Gurgaon, Delhi",
      createdAt: "2025-08-23",
      updatedAt: "2025-08-23",
    },
    {
      id: "5",
      email: "driver5@example.com",
      title: "Economy Taxi Service",
      category: "Taxi Driver",
      description:
        "Budget-friendly taxi service for daily commute. Reliable and affordable transportation solution.",
      state: "Tamil Nadu",
      city: "Chennai",
      phone: "+91 5432109876",
      whatsapp: "+91 5432109876",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      status: "inactive",
      adType: "Normal",
      location: "Chennai, Tamil Nadu",
      createdAt: "2025-08-24",
      updatedAt: "2025-08-24",
    },
  ]);

  const addAd = (
    adData: Omit<
      Advertisement,
      "id" | "status" | "adType" | "location" | "createdAt" | "updatedAt"
    >
  ) => {
    const newAd: Advertisement = {
      ...adData,
      id: Date.now().toString(),
      status: "inactive", // New ads start in "inactive" (publish) state
      adType: "Normal",
      location: `${adData.city}, ${adData.state}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setAds((prev) => [...prev, newAd]);
  };

  const updateAd = (id: string, updatedData: Partial<Advertisement>) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === id
          ? {
              ...ad,
              ...updatedData,
              location:
                updatedData.city && updatedData.state
                  ? `${updatedData.city}, ${updatedData.state}`
                  : ad.location,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : ad
      )
    );
  };

  const getAdById = (id: string) => {
    return ads.find((ad) => ad.id === id);
  };

  return (
    <AdsContext.Provider value={{ ads, addAd, updateAd, getAdById }}>
      {children}
    </AdsContext.Provider>
  );
};
