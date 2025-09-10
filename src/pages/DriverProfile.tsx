import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import SimilarProfiles from "../components/SimilarProfiles";
import DriverTierTag, { DriverTier } from "../components/DriverTierTags";

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
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      if (!driverId) {
        setError("Advertisement ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const adDoc = doc(db, "adData", driverId);
        const adSnapshot = await getDoc(adDoc);

        if (adSnapshot.exists()) {
          const adData = adSnapshot.data();
          
          // Fetch user email from users collection
          let userEmail = "";
          if (adData.userId) {
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
            id: adSnapshot.id,
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
  }, [driverId]);

  const handleGoBack = () => {
    navigate(-1);
  };

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
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-900 text-center lg:text-left">
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

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {advertisement.description}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                📍 {advertisement.city}, {advertisement.state}
              </p>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-row sm:flex-col gap-3 justify-center lg:justify-start">
              <a
                href={`https://wa.me/${advertisement.phoneNumber.replace(
                  /[^0-9]/g,
                  ""
                )}?text=Hi%20${encodeURIComponent(
                  advertisement.title
                )},%20I%20would%20like%20to%20book%20your%20taxi%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-none"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${advertisement.phoneNumber}`}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-none"
              >
                <span>Contact</span>
              </a>
              {advertisement.email && (
                <a
                  href={`mailto:${advertisement.email}?subject=Inquiry%20about%20${encodeURIComponent(
                    advertisement.title
                  )}&body=Hi,%20I%20would%20like%20to%20inquire%20about%20your%20taxi%20service.`}
                  className="bg-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-none"
                >
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Photos Section - Responsive Grid */}
            {advertisement.photoUrls && advertisement.photoUrls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {advertisement.photoUrls.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="aspect-[4/3] sm:aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt={`Advertisement photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No photos available</p>
              </div>
            )}

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
            {advertisement.email && (
              <div className="flex flex-col xs:flex-row px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
                <div className="w-full xs:w-32 sm:w-36 font-semibold text-gray-800 text-sm sm:text-base mb-1 xs:mb-0">
                  Email:
                </div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <a
                    href={`mailto:${advertisement.email}?subject=Inquiry%20about%20${encodeURIComponent(
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
        <div className="mt-6 sm:mt-8">
          <SimilarProfiles
            currentDriverId={advertisement.id}
            city={advertisement.city}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
