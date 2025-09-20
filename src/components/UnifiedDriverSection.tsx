import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Car, MessageCircle, Crown, Star, Shield } from "lucide-react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
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

interface UnifiedDriverSectionProps {
  selectedState?: string;
  selectedCity?: string;
  selectedCategory?: string;
}

const UnifiedDriverSection: React.FC<UnifiedDriverSectionProps> = ({
  selectedState,
  selectedCity,
  selectedCategory,
}) => {
  const navigate = useNavigate();
  const [filteredAds, setFilteredAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 10;

  // Fetch advertisements from Firebase adData collection
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);

        // Get all ads first, then filter by both city and category
        const querySnapshot = await getDocs(collection(db, "adData"));
        const ads: Advertisement[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Show both old "published" ads and new "approved" ads
          if (
            (data.status === "approved" || data.status === "published") &&
            data.approved
          ) {
            // Apply city filter
            const cityMatches =
              !selectedCity ||
              selectedCity === "all" ||
              data.city === selectedCity;

            // Apply category filter (convert URL format back to original format for comparison)
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
              } as Advertisement);
            }
          }
        });

        // Sort by priority: VIP Prime (1), VIP (2), Free (3)
        ads.sort((a, b) => {
          const getPriority = (tag: string) => {
            if (tag === "vip-prime") return 1;
            if (tag === "vip") return 2;
            return 3; // free
          };
          return getPriority(a.tag) - getPriority(b.tag);
        });

        setFilteredAds(ads);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [selectedCity, selectedCategory]);

  // Pagination calculations
  const totalAds = filteredAds.length;
  const totalPages = Math.ceil(totalAds / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const currentAds = filteredAds.slice(startIndex, endIndex);

  // Show message if no ads match the filter
  if (
    filteredAds.length === 0 &&
    (selectedState || selectedCity || selectedCategory)
  ) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              {selectedCategory && selectedCity ? (
                <>
                  No {selectedCategory} ads available in {selectedCity}. Try
                  selecting a different location or category.
                </>
              ) : selectedCategory ? (
                <>
                  No {selectedCategory} ads available. Try selecting a different
                  category.
                </>
              ) : selectedCity ? (
                <>
                  No ads available in {selectedCity}. Try selecting a different
                  location.
                </>
              ) : (
                <>No ads available. Try adjusting your search criteria.</>
              )}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading advertisements...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no ads for current page (shouldn't happen normally)
  if (filteredAds.length > 0 && currentAds.length === 0) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Page not found
            </h3>
            <p className="text-gray-500">
              This page doesn't exist. Please try a different page.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const getCardStyling = (ad: Advertisement) => {
    if (ad.tag === "vip-prime") {
      return {
        containerClass: "relative",
        frameClass: "bg-white rounded-3xl border-2 border-gray-200 shadow-2xl",
        backgroundClass: "p-8",
        badgeClass: "",
        badgeText: "VIP Prime",
        hasFloatingBadge: true,
      };
    }
    if (ad.tag === "vip") {
      return {
        containerClass: "relative",
        frameClass: "bg-white rounded-3xl border-2 border-gray-200 shadow-xl",
        backgroundClass: "p-8",
        badgeClass: "",
        badgeText: "VIP",
        hasFloatingBadge: true,
      };
    }
    return {
      containerClass: "relative",
      frameClass: "bg-white rounded-3xl border-2 border-gray-300 shadow-lg",
      backgroundClass: "p-8",
      badgeClass: "",
      badgeText: "FREE",
      hasFloatingBadge: true,
    };
  };

  const getPremiumBadge = (ad: Advertisement) => {
    if (ad.tag === "vip-prime") {
      return (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 lg:right-10 lg:left-auto lg:translate-x-0">
          <div className="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 px-4 py-1 rounded-full shadow-md flex items-center gap-2 border border-yellow-300">
            <Crown className="h-5 w-5 text-yellow-800" />
            <span className="text-yellow-900 font-serif font-bold text-sm uppercase tracking-wider">
              VIP Prime
            </span>
          </div>
        </div>
      );
    }

    if (ad.tag === "vip") {
      return (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 lg:right-16 lg:left-auto lg:translate-x-0">
          <div className="bg-white px-4 py-1 rounded-full shadow-md flex items-center gap-2 border border-indigo-800">
            <Shield
              className="h-5 w-5 text-indigo-800"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
            />{" "}
            <span
              className="text-indigo-900 font-serif font-bold text-sm uppercase tracking-wider"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}
            >
              {" "}
              VIP{" "}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 lg:right-16 lg:left-auto lg:translate-x-0">
        <div className="bg-white px-4 py-1 rounded-full shadow-md flex items-center gap-2 border border-sky-400">
          <Star
            className="h-5 w-5 text-sky-600"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          />{" "}
          <span
            className="text-sky-600 font-serif font-bold text-sm uppercase tracking-wider"
            style={{ textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}
          >
            {" "}
            Free{" "}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified Ads List with Premium Badges */}
        <div className="space-y-6">
          {currentAds.map((ad) => {
            const styling = getCardStyling(ad);

            return (
              <div key={ad.id} className={styling.containerClass}>
                {/* Premium Badge */}
                {getPremiumBadge(ad)}

                {/* Main Card with Frame Border */}
                <div
                  className={`block cursor-pointer ${styling.frameClass}`}
                  style={
                    ad.tag === "vip-prime"
                      ? {
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #fefce8 100%)",
                          borderColor: "#fbbf24",
                        }
                      : ad.tag === "vip"
                      ? {
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)",
                          borderColor: "#8b5cf6",
                        }
                      : {
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)",
                          borderColor: "#38bdf8",
                        }
                  }
                >
                  <div className={styling.backgroundClass}>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                      {/* Ad Info Section */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8 flex-1">
                        {/* Ad Image with Premium Ring */}
                        <div className="flex-shrink-0 relative">
                          {ad.tag === "vip-prime" && (
                            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-xl blur-sm opacity-30 animate-pulse"></div>
                          )}
                          {ad.tag === "vip" && (
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-xl blur-sm opacity-25"></div>
                          )}
                          {/* Added glow for FREE ads */}
                          {ad.tag === "free" && (
                            <div className="absolute -inset-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 rounded-xl blur-sm opacity-20"></div>
                          )}

                          {ad.photoUrls && ad.photoUrls.length > 0 ? (
                            <img
                              src={ad.photoUrls[0]}
                              alt={ad.title}
                              className={`relative w-32 h-32 rounded-xl object-cover shadow-lg ${
                                ad.tag === "vip-prime"
                                  ? "ring-4 ring-amber-300"
                                  : ad.tag === "vip"
                                  ? "ring-4 ring-purple-300"
                                  : "ring-4 ring-sky-200" // Updated ring for FREE ads
                              }`}
                            />
                          ) : (
                            <div
                              className={`relative w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center shadow-lg ${
                                ad.tag === "vip-prime"
                                  ? "ring-4 ring-amber-300"
                                  : ad.tag === "vip"
                                  ? "ring-4 ring-purple-300"
                                  : "ring-4 ring-sky-200"
                              }`}
                            >
                              <Car className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Ad Details */}
                        <div className="flex-1 space-y-4 text-center sm:text-left min-w-0 overflow-hidden">
                          {/* Title with Premium Styling */}
                          <h3
                            className={`text-xl sm:text-2xl font-bold leading-tight break-words overflow-hidden max-w-full ${
                              ad.tag === "vip-prime"
                                ? "text-amber-900 drop-shadow-sm"
                                : ad.tag === "vip"
                                ? "text-purple-900"
                                : "text-gray-900"
                            }`}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              wordBreak: "break-word",
                            }}
                          >
                            {ad.title}
                            {ad.tag === "vip-prime" && (
                              <Crown className="inline ml-2 h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                            )}
                            {ad.tag === "vip" && (
                              <Shield className="inline ml-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                            )}
                          </h3>

                          {/* Premium Description */}
                          <p
                            className={`text-sm sm:text-base leading-relaxed break-words overflow-hidden max-w-full ${
                              ad.tag === "vip-prime"
                                ? "text-amber-800"
                                : ad.tag === "vip"
                                ? "text-purple-800"
                                : "text-gray-700"
                            }`}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              wordBreak: "break-word",
                            }}
                          >
                            {ad.description}
                          </p>

                          {/* Location with Premium Accent */}
                          <p
                            className={`text-sm sm:text-base font-medium break-words overflow-hidden max-w-full ${
                              ad.tag === "vip-prime"
                                ? "text-amber-700"
                                : ad.tag === "vip"
                                ? "text-purple-700"
                                : "text-gray-600"
                            }`}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              wordBreak: "break-word",
                            }}
                          >
                            📍 {ad.city}, {ad.state}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {ad.tag !== "free" ? (
                        // VIP & VIP Prime → WhatsApp + Contact + View AD
                        <div className="flex flex-col gap-3 min-w-[160px]">
                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${ad.phoneNumber.replace(
                              /[^0-9]/g,
                              ""
                            )}?text=Hi,%20I%20would%20like%20to%20book%20your%20${
                              ad.tag === "vip-prime"
                                ? "VIP Prime luxury"
                                : ad.tag === "vip"
                                ? "VIP premium"
                                : "FREE"
                            } taxi%20service.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 relative z-10 ${
                              ad.tag === "vip-prime"
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                                : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle size={20} />
                            WhatsApp
                          </a>

                          {/* Contact */}
                          <a
                            href={`tel:${ad.phoneNumber}`}
                            className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 relative z-10 ${
                              ad.tag === "vip-prime"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={20} />
                            Contact
                          </a>

                          {/* View AD */}
                          <div
                            className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 cursor-pointer ${
                              ad.tag === "vip-prime"
                                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                                : "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(generateAdUrlFromAd(ad));
                            }}
                          >
                            <span>👤</span>
                            View AD
                          </div>
                        </div>
                      ) : (
                        // FREE ads → Column layout for md and sm, centered for lg+
                        <div className="flex flex-col md:flex-col lg:flex lg:items-center lg:justify-center gap-3 min-w-[160px] lg:self-stretch">
                          <div
                            className="w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 cursor-pointer bg-teal-500 text-white shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(generateAdUrlFromAd(ad));
                            }}
                          >
                            <span>👤</span>
                            View AD
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Info and Controls at Bottom */}
        <div className="text-center mt-8">
          <div className="text-sm text-gray-500 mb-4">
            Showing {startIndex + 1}-{Math.min(endIndex, totalAds)} of{" "}
            {totalAds} ads
            {totalPages > 1 && (
              <span className="ml-2">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UnifiedDriverSection;
