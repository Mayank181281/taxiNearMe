import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { findAdBySlug } from "../utils/urlUtils";
import SimilarProfiles from "../components/SimilarProfiles";
import DriverTierTag, { DriverTier } from "../components/DriverTierTags";
import { useDriverSEO } from "../hooks/useSEO";
import type { DriverProfile as DriverProfileType } from "../utils/structuredData";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  phoneNumber: string;
  email?: string;
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

const DriverProfile: React.FC = () => {
  const { driverId, citySlug, categorySlug, titleSlug } = useParams<{
    driverId?: string;
    citySlug?: string;
    categorySlug?: string;
    titleSlug?: string;
  }>();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prepare driver profile data for SEO
  const driverProfile: DriverProfileType = advertisement ? {
    id: advertisement.id,
    name: advertisement.title,
    phone: advertisement.phoneNumber,
    email: advertisement.email,
    city: advertisement.city,
    state: advertisement.state,
    description: advertisement.description,
    image: advertisement.photoUrls?.[0]
  } : {
    id: driverId || titleSlug || 'unknown',
    name: 'Driver Profile',
    city: citySlug || 'Unknown',
    state: 'Unknown'
  };

  // SEO optimization for driver profile
  useDriverSEO(driverProfile);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      // Check if we have a driverId (legacy URL) or slug parameters (new URL)
      if (!driverId && (!citySlug || !categorySlug || !titleSlug)) {
        setError("Advertisement not found - invalid URL");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let adData = null;

        if (driverId) {
          // Legacy URL format: /driver/:driverId
          const adDoc = doc(db, "adData", driverId);
          const adSnapshot = await getDoc(adDoc);

          if (adSnapshot.exists()) {
            adData = {
              id: adSnapshot.id,
              ...adSnapshot.data(),
            };
          }
        } else if (citySlug && categorySlug && titleSlug) {
          // New SEO-friendly URL format: /:citySlug/:categorySlug/:titleSlug
          adData = await findAdBySlug(citySlug, categorySlug, titleSlug);
        }

        if (adData) {
          // Fetch user email from users collection
          let userEmail = "";
          if (adData.userId && typeof adData.userId === "string") {
            try {
              const userDoc = doc(db, "users", adData.userId);
              const userSnapshot = await getDoc(userDoc);
              if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                userEmail = userData.email || "";
              }
            } catch (err) {
              console.error("Error fetching user email:", err);
            }
          }

          setAdvertisement({
            ...adData,
            email: userEmail,
          } as Advertisement);
        } else {
          setError("Advertisement not found");
        }
      } catch (err) {
        console.error("Error fetching advertisement:", err);
        setError("Failed to load advertisement details");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [driverId, citySlug, categorySlug, titleSlug]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const openImageModal = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  }, []);

  const navigateImage = useCallback(
    (direction: "prev" | "next") => {
      if (!advertisement?.photoUrls || selectedImageIndex === null) return;

      const totalImages = advertisement.photoUrls.length;
      if (direction === "prev") {
        setSelectedImageIndex(
          selectedImageIndex === 0 ? totalImages - 1 : selectedImageIndex - 1
        );
      } else {
        setSelectedImageIndex(
          selectedImageIndex === totalImages - 1 ? 0 : selectedImageIndex + 1
        );
      }
    },
    [advertisement?.photoUrls, selectedImageIndex]
  );

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (event.key) {
        case "Escape":
          closeImageModal();
          break;
        case "ArrowLeft":
          navigateImage("prev");
          break;
        case "ArrowRight":
          navigateImage("next");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeImageModal, navigateImage]);

  // Helper function to determine driver tier from ad tag
  const getDriverTier = (): DriverTier => {
    if (!advertisement) return "free";
    if (advertisement.tag === "vip-prime") return "vip-prime";
    if (advertisement.tag === "vip") return "vip";
    return "free";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading advertisement details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !advertisement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Advertisement Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            {error || "The requested advertisement could not be found."}
          </p>
          <button
            onClick={handleGoBack}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 sm:mb-6 flex items-center text-sm sm:text-base"
        >
          ← Back to Ads
        </button>

        {/* Advertisement Profile Card - Responsive Layout */}
        <div className="bg-blue-50 rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            {/* Ad Info - Responsive layout */}
            <div className="flex-1 space-y-3 sm:space-y-4 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start gap-2 sm:gap-3">
                <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 text-center lg:text-left break-words word-break leading-tight max-w-full overflow-hidden">
                  {advertisement.title}
                </h1>
                <div className="flex justify-center lg:justify-start">
                  <DriverTierTag
                    tier={getDriverTier()}
                    size="sm"
                    className="shrink-0"
                  />
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words max-w-full">
                {advertisement.description}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 font-medium break-words">
                📍 {advertisement.city}, {advertisement.state}
              </p>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto lg:w-auto">
              {/* Only show WhatsApp and Contact buttons for VIP and VIP Prime ads */}
              {advertisement.tag !== "free" && (
                <>
                  <a
                    href={`https://wa.me/${advertisement.phoneNumber.replace(
                      /[^0-9]/g,
                      ""
                    )}?text=Hi%20${encodeURIComponent(
                      advertisement.title
                    )},%20I%20would%20like%20to%20book%20your%20taxi%20service.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-green-700 transition-colors flex items-center justify-center w-full sm:w-[140px] lg:w-[140px]"
                  >
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${advertisement.phoneNumber}`}
                    className="bg-blue-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-[140px] lg:w-[140px]"
                  >
                    <span>Contact</span>
                  </a>
                </>
              )}
              {/* Email button is always shown for all ad types */}
              {advertisement.email && (
                <a
                  href={`mailto:${
                    advertisement.email
                  }?subject=Inquiry%20about%20${encodeURIComponent(
                    advertisement.title
                  )}&body=Hi,%20I%20would%20like%20to%20inquire%20about%20your%20taxi%20service.`}
                  className="bg-purple-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center w-full sm:w-[140px] lg:w-[140px]"
                >
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Photos Section - Responsive Grid */}
        <div>
          {advertisement.photoUrls && advertisement.photoUrls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {advertisement.photoUrls.map((imageUrl, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] sm:aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group relative"
                  onClick={() => openImageModal(index)}
                >
                  <img
                    src={imageUrl}
                    alt={`Advertisement photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No photos available</p>
            </div>
          )}
        </div>

        {/* Profile Info Section - Responsive Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mt-4 sm:mt-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Advertisement Details
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                Title:
              </div>
              <div className="text-gray-700 text-sm sm:text-base break-words">
                {advertisement.title}
              </div>
            </div>
            {/* Only show phone number for VIP and VIP Prime ads */}
            {advertisement.tag !== "free" && (
              <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-white">
                <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                  Phone:
                </div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <a
                    href={`tel:${advertisement.phoneNumber}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {advertisement.phoneNumber}
                  </a>
                </div>
              </div>
            )}
            {/* Email is always shown for all ad types */}
            {advertisement.email && (
              <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
                <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                  Email:
                </div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <a
                    href={`mailto:${
                      advertisement.email
                    }?subject=Inquiry%20about%20${encodeURIComponent(
                      advertisement.title
                    )}&body=Hi,%20I%20would%20like%20to%20inquire%20about%20your%20taxi%20service.`}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    {advertisement.email}
                  </a>
                </div>
              </div>
            )}
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-white">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                Category:
              </div>
              <div className="text-gray-700 text-sm sm:text-base flex items-center">
                <DriverTierTag tier={getDriverTier()} size="sm" />
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                State:
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                {advertisement.state}
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-white">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                City:
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                {advertisement.city}
              </div>
            </div>
            <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
              <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                Service Category:
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                {advertisement.category}
              </div>
            </div>
            {advertisement.publishedAt && (
              <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-white">
                <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                  Published On:
                </div>
                <div className="text-gray-700 text-sm sm:text-base">
                  {advertisement.publishedAt.toDate().toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Profiles Section */}
        <div className="mt-6 sm:mt-8 ">
          <SimilarProfiles
            currentDriverId={advertisement.id}
            city={advertisement.city}
          />
        </div>

        {/* Full-Screen Image Modal */}
        {isModalOpen &&
          selectedImageIndex !== null &&
          advertisement.photoUrls && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors p-2"
                aria-label="Close modal"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Previous Button */}
              {advertisement.photoUrls.length > 1 && (
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors p-2"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-10 h-10"
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
              )}

              {/* Next Button */}
              {advertisement.photoUrls.length > 1 && (
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors p-2"
                  aria-label="Next image"
                >
                  <svg
                    className="w-10 h-10"
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
              )}

              {/* Main Image Container */}
              <div
                className="w-full h-full flex items-center justify-center p-2 sm:p-4"
                onClick={closeImageModal}
              >
                <img
                  src={advertisement.photoUrls[selectedImageIndex]}
                  alt={`Advertisement photo ${selectedImageIndex + 1}`}
                  className="w-[95vw] h-[95vh] object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Image Counter */}
              {advertisement.photoUrls.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {selectedImageIndex + 1} / {advertisement.photoUrls.length}
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default DriverProfile;
