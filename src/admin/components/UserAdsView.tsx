import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserAdvertisements,
  UserAdvertisement,
} from "../../services/userAdService";

interface UserAdsViewProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

const UserAdsView: React.FC<UserAdsViewProps> = ({
  userId,
  userName,
  onClose,
}) => {
  const navigate = useNavigate();
  const [ads, setAds] = useState<UserAdvertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "free" | "vip" | "vip-prime">(
    "all"
  );

  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        setLoading(true);
        console.log("UserAdsView: Fetching ads for user:", userId);
        const userAds = await getUserAdvertisements(userId);
        console.log("UserAdsView: Received ads:", userAds.length, "ads");
        setAds(userAds);
      } catch (error) {
        console.error("UserAdsView: Error fetching user ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAds();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "vip-prime":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "vip":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "free":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const filteredAds = ads.filter((ad) => {
    const matchesFilter = filter === "all" || ad.tag === filter;
    return matchesFilter;
  });

  const getAdCounts = () => {
    return {
      total: ads.length,
      vipPrime: ads.filter((ad) => ad.tag === "vip-prime").length,
      vip: ads.filter((ad) => ad.tag === "vip").length,
      free: ads.filter((ad) => ad.tag === "free").length,
      pending: ads.filter((ad) => ad.status === "pending").length,
      approved: ads.filter(
        (ad) => ad.status === "approved" || ad.approved === true
      ).length,
      rejected: ads.filter((ad) => ad.status === "rejected").length,
    };
  };

  const counts = getAdCounts();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Advertisements by {userName}
              </h2>
              <p className="text-gray-600 text-sm mt-1">User ID: {userId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <svg
                className="w-6 h-6"
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
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {counts.total}
              </div>
              <div className="text-sm text-blue-600">Total Ads</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {counts.vipPrime}
              </div>
              <div className="text-sm text-orange-600">VIP Prime</div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {counts.vip}
              </div>
              <div className="text-sm text-indigo-600">VIP</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-600">
                {counts.free}
              </div>
              <div className="text-sm text-gray-600">Free</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex space-x-2">
              {(["all", "free", "vip", "vip-prime"] as const).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === tag
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tag === "vip-prime" ? "VIP Prime" : tag.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading advertisements...</p>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No ads found
              </h3>
              <p className="text-gray-600">
                No advertisements match the current filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Ad Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border uppercase ${getTagColor(
                          ad.tag
                        )}`}
                      >
                        {ad.tag === "vip-prime"
                          ? "VIP Prime"
                          : ad.tag.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusColor(
                          ad.status
                        )}`}
                      >
                        {ad.status}
                      </span>
                    </div>
                  </div>

                  {/* Ad Image */}
                  {ad.images && ad.images.length > 0 && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <img
                        src={ad.images[0]}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Ad Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {ad.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {ad.description}
                    </p>

                    {/* Plan Duration */}
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Duration:</span>{" "}
                      {ad.planDuration} {ad.planUnit}
                      {ad.planDuration !== 1 ? "s" : ""}
                    </div>

                    {/* Location */}
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Location:</span>{" "}
                      {ad.location.city}, {ad.location.state}
                    </div>

                    {/* Date */}
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Created:</span>{" "}
                      {formatDate(ad.createdAt)}
                    </div>

                    {/* Expiry Date */}
                    {ad.expiryDate && (
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Expires:</span>{" "}
                        {formatDate(ad.expiryDate)}
                      </div>
                    )}

                    {/* Payment Information */}
                    {(ad.paymentMode || ad.transactionId) &&
                      ad.tag !== "free" && (
                        <div className="border-t pt-2 mt-2">
                          <div className="text-xs font-medium text-gray-700 mb-1">
                            Payment Details:
                          </div>
                          {ad.paymentMode && (
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Mode:</span>{" "}
                              {ad.paymentMode}
                            </div>
                          )}
                          {ad.transactionId && (
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">UPI ID:</span>{" "}
                              {ad.transactionId}
                            </div>
                          )}
                        </div>
                      )}

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => navigate(`/admin/ad-details/${ad.id}`)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        See More Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAdsView;
