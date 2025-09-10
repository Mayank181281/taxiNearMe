import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAdvertisementDetails,
  UserAdvertisement,
} from "../../services/userAdService";

const AdDetails: React.FC = () => {
  const { adId } = useParams<{ adId: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<UserAdvertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdDetails = async () => {
      if (!adId) {
        setError("No advertisement ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const adDetails = await getAdvertisementDetails(adId);
        if (adDetails) {
          setAd(adDetails);
        } else {
          setError("Advertisement not found");
        }
      } catch (err) {
        console.error("Error fetching ad details:", err);
        setError("Failed to load advertisement details");
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [adId]);

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

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advertisement details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Advertisement Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested advertisement could not be found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Advertisement Details
                </h1>
                <p className="text-gray-600">ID: {ad.adId}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full border capitalize ${getStatusColor(
                  ad.status
                )}`}
              >
                {ad.status}
              </span>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full border uppercase ${getTagColor(
                  ad.tag
                )}`}
              >
                {ad.tag === "vip-prime" ? "VIP Prime" : ad.tag.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ad Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {ad.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                    {ad.description || "No description provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Location Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {ad.location.city || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {ad.location.state || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {ad.contact.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {ad.contact.whatsapp || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Images */}
            {ad.images && ad.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Images ({ad.images.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ad.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Ad image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(image, "_blank")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Plan Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Plan Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Plan
                  </label>
                  <span
                    className={`inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full border uppercase ${getTagColor(
                      ad.tag
                    )}`}
                  >
                    {ad.tag === "vip-prime"
                      ? "VIP Prime"
                      : ad.tag.toUpperCase()}
                  </span>
                </div>
                
                {/* Previous Plan Information */}
                {ad.originalTag && ad.originalTag !== ad.tag && (
                  <div className="border-t pt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Previous Plan
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border uppercase ${getTagColor(
                            ad.originalTag
                          )}`}
                        >
                          {ad.originalTag === "vip-prime"
                            ? "VIP Prime"
                            : ad.originalTag.toUpperCase()}
                        </span>
                        {ad.autoDowngraded && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 border-orange-200">
                            Auto-downgraded
                          </span>
                        )}
                      </div>
                      {ad.downgradedAt && (
                        <p className="text-sm text-gray-500 mt-1">
                          Downgraded on: {formatDate(ad.downgradedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plan Duration
                  </label>
                  <p className="text-gray-900 mt-1">
                    {ad.planDuration} {ad.planUnit}
                    {ad.planDuration !== 1 ? "s" : ""}
                  </p>
                </div>
                {ad.expiryDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Expires
                    </label>
                    <p className="text-gray-900 mt-1">
                      {formatDate(ad.expiryDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            {(ad.paymentMode || ad.transactionId) && ad.tag !== "free" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Information
                </h2>
                <div className="space-y-3">
                  {ad.paymentMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Mode
                      </label>
                      <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
                        {ad.paymentMode}
                      </p>
                    </div>
                  )}
                  {ad.transactionId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        UPI Transaction ID
                      </label>
                      <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg font-mono text-sm break-all">
                        {ad.transactionId}
                      </p>
                    </div>
                  )}
                  {!ad.paymentMode && !ad.transactionId && (
                    <p className="text-gray-500 italic">
                      No payment information available for this advertisement.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* System Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                System Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 p-2 rounded">
                    {ad.userId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Advertisement ID
                  </label>
                  <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-50 p-2 rounded">
                    {ad.adId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created At
                  </label>
                  <p className="text-gray-900 mt-1">
                    {formatDate(ad.createdAt)}
                  </p>
                </div>
                {ad.updatedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Updated At
                    </label>
                    <p className="text-gray-900 mt-1">
                      {formatDate(ad.updatedAt)}
                    </p>
                  </div>
                )}
                {ad.paymentDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Date
                    </label>
                    <p className="text-gray-900 mt-1">
                      {formatDate(ad.paymentDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Status Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Status
                  </label>
                  <span
                    className={`inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full border capitalize ${getStatusColor(
                      ad.status
                    )}`}
                  >
                    {ad.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approved
                  </label>
                  <p className="text-gray-900 mt-1">
                    {ad.approved === true
                      ? "✅ Yes"
                      : ad.approved === false
                      ? "❌ No"
                      : "⏳ Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
