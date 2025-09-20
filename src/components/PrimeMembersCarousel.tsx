import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { generateAdUrlFromAd } from "../utils/urlUtils";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  phoneNumber: string;
  city: string;
  state: string;
  category: string;
  photoUrls: string[];
  tag: "free" | "vip" | "vip-prime";
  approved: boolean;
  status: "published";
  userId: string;
  createdAt: Timestamp;
  publishedAt?: Timestamp;
  planDuration: number;
  planUnit: "Day";
  expiryDate?: Timestamp;
}

interface PrimeMembersCarouselProps {
  selectedState?: string;
  selectedCity?: string;
  selectedCategory?: string;
}

const PrimeMembersCarousel: React.FC<PrimeMembersCarouselProps> = ({
  selectedCity,
  selectedCategory,
}) => {
  const [vipPrimeAds, setVipPrimeAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Fetch VIP Prime ads from Firebase
  const fetchVipPrimeAds = useCallback(async () => {
    console.log(
      "PrimeMembersCarousel - fetchVipPrimeAds called with selectedCity:",
      selectedCity,
      "selectedCategory:",
      selectedCategory
    );
    try {
      setLoading(true);

      // Get all VIP Prime ads first, then filter by city and category
      const adsQuery = query(
        collection(db, "adData"),
        where("tag", "==", "vip-prime"),
        where("approved", "==", true)
      );

      const querySnapshot = await getDocs(adsQuery);
      const ads: Advertisement[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Advertisement, "id">;

        // Apply city filter
        const cityMatches = !selectedCity || data.city === selectedCity;

        // Apply category filter
        let categoryMatches = true;
        if (selectedCategory) {
          // Normalize both stored category and selected category for comparison
          const normalizedStoredCategory =
            data.category?.toLowerCase().trim() || "";
          const normalizedSelectedCategory = selectedCategory
            .toLowerCase()
            .trim();
          categoryMatches =
            normalizedStoredCategory === normalizedSelectedCategory;
        }

        if (cityMatches && categoryMatches) {
          ads.push({
            id: doc.id,
            ...data,
          });
        }
      });

      setVipPrimeAds(ads);
    } catch (error) {
      console.error("Error fetching VIP Prime ads:", error);
      setVipPrimeAds([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedCategory]); // Fetch ads when selectedCity changes
  useEffect(() => {
    fetchVipPrimeAds();
  }, [fetchVipPrimeAds]);

  // Auto-scroll functionality - simple carousel
  useEffect(() => {
    if (!isAutoScrolling || vipPrimeAds.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Reset to beginning when we reach the end
        if (nextIndex >= vipPrimeAds.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 3000); // Move every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling, vipPrimeAds.length]);

  // Don't render the component if loading or no ads available
  if (loading) {
    console.log("PrimeMembersCarousel - Loading state, not rendering yet");
    return null;
  }

  if (vipPrimeAds.length === 0) {
    console.log(
      "PrimeMembersCarousel - No VIP Prime ads found, not rendering carousel"
    );
    return null;
  }

  console.log(
    "PrimeMembersCarousel - Rendering carousel with",
    vipPrimeAds.length,
    "ads"
  );

  return (
    <div className="mb-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          VIP Prime Members
        </h2>
        {vipPrimeAds.length > 4 && (
          <div className="flex space-x-1">
            {Array.from({ length: Math.ceil(vipPrimeAds.length / 4) }).map(
              (_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / 4) === index
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                  }`}
                />
              )
            )}
          </div>
        )}
      </div> */}

      {/* Carousel Container */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out space-x-3"
          style={{
            transform: `translateX(-${currentIndex * (144 + 12)}px)`, // 144px card width + 12px gap
          }}
        >
          {/* Show only original ads - NO DUPLICATES */}
          {vipPrimeAds.map((ad, index) => {
            // Subtle, professional colors
            const colors = [
              "bg-slate-600",
              "bg-gray-600",
              "bg-zinc-600",
              "bg-stone-600",
              "bg-neutral-600",
              "bg-slate-700",
            ];
            const bgColor = colors[index % colors.length];

            return (
              <Link
                key={ad.id} // Use unique ad ID only
                to={generateAdUrlFromAd(ad)}
                className="w-36 flex-shrink-0"
              >
                <div
                  className={`${bgColor} rounded-lg relative text-center text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden h-40`}
                >
                  {/* Custom Premium Badge for Carousel */}
                  <div className="absolute top-1 left-1 z-10 transform scale-[0.8] origin-top-left">
                    <div className="flex items-center gap-1 text-yellow-900 font-black tracking-wider transition-all duration-300 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 border-2 border-yellow-500 shadow-lg hover:shadow-xl hover:shadow-yellow-400/50 px-2 py-0.5 rounded-full">
                      <Crown
                        className="h-3 w-3 text-yellow-800 filter drop-shadow-sm"
                        strokeWidth={3}
                      />
                      <span className="text-[8px] uppercase font-black">
                        VIP PRIME
                      </span>
                    </div>
                  </div>

                  {/* Profile Image - Rectangular coverage */}
                  <div className="relative h-32">
                    {ad.photoUrls && ad.photoUrls.length > 0 ? (
                      <img
                        src={ad.photoUrls[0]}
                        alt={ad.title}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Title at bottom */}
                  <div className="absolute bottom-1 left-0 right-0 px-1">
                    <h3 className="text-xs font-semibold leading-tight text-white drop-shadow-sm">
                      {ad.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrimeMembersCarousel;
