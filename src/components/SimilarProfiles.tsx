import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

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

interface SimilarProfilesProps {
  currentDriverId: string;
  city: string;
}

const SimilarProfiles: React.FC<SimilarProfilesProps> = ({
  currentDriverId,
  city,
}) => {
  const [similarAds, setSimilarAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarAds = async () => {
      try {
        setLoading(true);

        const cityQuery = query(
          collection(db, "adData"),
          where("city", "==", city),
          where("approved", "==", true)
        );

        const querySnapshot = await getDocs(cityQuery);
        const ads: Advertisement[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id !== currentDriverId) {
            ads.push({
              id: doc.id,
              ...data,
            } as Advertisement);
          }
        });

        ads.sort((a, b) => {
          const getPriority = (tag: string) => {
            if (tag === "vip-prime") return 1;
            if (tag === "vip") return 2;
            return 3;
          };
          return getPriority(a.tag) - getPriority(b.tag);
        });

        setSimilarAds(ads.slice(0, 2));
      } catch (error) {
        console.error("Error fetching similar ads:", error);
        setSimilarAds([]);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchSimilarAds();
    } else {
      setLoading(false);
    }
  }, [city, currentDriverId]);

  if (loading) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Similar Listing
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex animate-pulse"
            >
              <div className="w-32 h-32 bg-gray-200 flex-shrink-0"></div>
              <div className="p-3 flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="flex space-x-1">
                  <div className="h-6 bg-gray-200 rounded flex-1"></div>
                  <div className="h-6 bg-gray-200 rounded flex-1"></div>
                  <div className="h-6 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (similarAds.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Similar Listing</h2>
      </div>

      {/* Ad Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-40">
        {similarAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex"
          >
            {/* Ad Photo */}
            <div className="relative w-32 flex-shrink-0">
              {ad.photoUrls && ad.photoUrls.length > 0 ? (
                <img
                  src={ad.photoUrls[0]}
                  alt={ad.title}
                  className="w-full h-full object-cover"
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
            </div>

            {/* Ad Details */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900">
                {ad.title.length > 40
                  ? ad.title.substring(0, 40) + "..."
                  : ad.title}
              </h3>

              {/* Description */}
              <div className="mb-3">
                <p className="text-xs text-gray-700 leading-relaxed">
                  {ad.description.length > 80
                    ? ad.description.substring(0, 80) + "..."
                    : ad.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                <a
                  href={`https://wa.me/${ad.phoneNumber.replace(
                    /[^0-9]/g,
                    ""
                  )}?text=Hi%20${encodeURIComponent(
                    ad.title
                  )},%20I%20would%20like%20to%20book%20your%20taxi%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white p-1.5 rounded-md hover:bg-green-600 transition-colors flex-1 flex items-center justify-center"
                  title="WhatsApp"
                >
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
                  </svg>
                </a>

                <a
                  href={`tel:${ad.phoneNumber}`}
                  className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600 transition-colors flex-1 flex items-center justify-center"
                  title="Call"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </a>

                <Link
                  to={`/driver/${ad.id}`}
                  className="bg-teal-500 text-white p-1.5 rounded-md hover:bg-teal-600 transition-colors flex-1 flex items-center justify-center"
                  title="View Profile"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProfiles;
