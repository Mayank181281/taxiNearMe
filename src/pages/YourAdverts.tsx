import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAds, Advertisement } from "../contexts/AdsContext";
import DriverTierTag from "../components/DriverTierTags";

const YourAdverts: React.FC = () => {
  const navigate = useNavigate();
  const { ads } = useAds();
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"month" | "day">("month");
  const [viewingAd, setViewingAd] = useState<Advertisement | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vip-prime":
        return <DriverTierTag tier="vip-prime" size="sm" />;
      case "vip":
        return <DriverTierTag tier="vip" size="sm" />;
      case "published":
        return (
          <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium">
            Published
          </span>
        );
      case "waiting-approval":
        return (
          <span className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
            <span className="hidden sm:inline">Pending</span>
            <span className="sm:hidden">Pending</span>
          </span>
        );
      case "inactive":
        return (
          <button
            onClick={() => setShowPlansModal(true)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer"
          >
            Publish
          </button>
        );
      default:
        return null;
    }
  };

  const PlansModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Suitable Packages</h2>

          {/* Period Toggle */}
          <div className="flex justify-center space-x-2 mb-6">
            <button
              onClick={() => setBillingPeriod("month")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                billingPeriod === "month"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              1 Month
            </button>
            <button
              onClick={() => setBillingPeriod("day")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                billingPeriod === "day"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              1 Day (24 hours)
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* VIP Plan */}
          <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
            <div className="text-center mb-4">
              <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm inline-block mb-2">
                VIP
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                ${billingPeriod === "month" ? "40" : "3"}
              </div>
              <div className="text-gray-600 text-sm">
                / {billingPeriod === "month" ? "Month" : "Day"}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>
                  <strong>Placement:</strong> Appears In Top Listings
                </span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>
                  <strong>Highlight:</strong> Driver Ad Card Is Marked With A
                  VIP Tag/Badge.
                </span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>
                  <strong>Exposure:</strong> 3X More Visibility Than Free/Normal
                  Ads.
                </span>
              </div>
              {billingPeriod === "day" && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>
                    <strong>Duration:</strong> 24-hour premium exposure.
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                const planType = "vip";
                const price = billingPeriod === "month" ? "40" : "3";
                navigate(
                  `/profile/payment?plan=${planType}&period=${billingPeriod}&price=${price}`
                );
              }}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Select Plan
            </button>
          </div>

          {/* VIP Prime Plan */}
          <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
            <div className="text-center mb-4">
              <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm inline-block mb-2">
                VIP Prime
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-1">
                ${billingPeriod === "month" ? "80" : "6"}
              </div>
              <div className="text-gray-600 text-sm">
                / {billingPeriod === "month" ? "Month" : "Day"}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span>
                  <strong>Placement:</strong> "VIP PRIME" Section
                </span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span>
                  <strong>Highlight:</strong> Driver Ad Card Is Marked With A
                  VIP PRIME Badge + Priority Highlight
                </span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span>
                  <strong>Exposure:</strong> 5X More Visibility Than Normal Ads.
                </span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span>
                  <strong>Rotation:</strong> Auto Rotated Randomly If There Are
                  Multiple VIP Prime Drivers.
                </span>
              </div>
              {billingPeriod === "day" && (
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span>
                    <strong>Duration:</strong> 24-hour premium priority
                    exposure.
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                const planType = "vip-prime";
                const price = billingPeriod === "month" ? "80" : "6";
                navigate(
                  `/profile/payment?plan=${planType}&period=${billingPeriod}&price=${price}`
                );
              }}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Select Plan
            </button>
          </div>
        </div>

        {/* Skip and Close buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowPlansModal(false)}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => setShowPlansModal(false)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const ViewAdModal = ({
    ad,
    onClose,
  }: {
    ad: Advertisement;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Advertisement Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Ad Image */}
          {ad.image && (
            <div className="text-center">
              <img
                src={ad.image}
                alt="Advertisement"
                className="w-32 h-32 rounded-lg object-cover mx-auto shadow-md"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {ad.title}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {ad.category}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md min-h-[100px]">
              {ad.description}
            </p>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {ad.state}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {ad.city}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {ad.phone}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {ad.whatsapp}
              </p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {ad.email}
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="bg-gray-50 p-3 rounded-md">
              {getStatusBadge(ad.status)}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Sort adverts by priority: VIP Prime -> VIP -> Published -> Waiting -> Inactive
  const sortedAdverts = [...ads].sort((a, b) => {
    const statusOrder = {
      "vip-prime": 1,
      vip: 2,
      published: 3,
      "waiting-approval": 4,
      inactive: 5,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* WhatsApp Contact Message */}
      <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm font-medium text-center">
          In case of any query and concern please contact this number{" "}
          <a
            href="https://wa.me/12345678901"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
          >
            (12345678901)
          </a>{" "}
          on WhatsApp
        </p>
      </div>

      <div className="space-y-6">
        {/* Adverts List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {sortedAdverts.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No adverts found
              </h3>
              <p className="mt-2 text-gray-500">
                You haven't created any adverts yet.
              </p>
              <Link
                to="/profile/post-ads"
                className="mt-4 inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create Your First Ad
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedAdverts.map((advert) => (
                <div
                  key={advert.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          advert.image ||
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-lg object-cover bg-gradient-to-br from-cyan-400 to-cyan-600"
                      />
                      <div className="text-center mt-1">
                        <span className="text-xs text-white bg-gray-800 px-2 py-1 rounded">
                          Ganesh Modi
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold hover:text-blue-800 ${
                              advert.status === "published" ||
                              advert.status === "vip" ||
                              advert.status === "vip-prime" ||
                              advert.status === "waiting-approval"
                                ? "text-blue-600 cursor-pointer underline-offset-2 hover:underline"
                                : "text-blue-600"
                            }`}
                            onClick={() => {
                              if (
                                advert.status === "published" ||
                                advert.status === "vip" ||
                                advert.status === "vip-prime" ||
                                advert.status === "waiting-approval"
                              ) {
                                setViewingAd(advert);
                              }
                            }}
                            title={
                              advert.status === "published" ||
                              advert.status === "vip" ||
                              advert.status === "vip-prime" ||
                              advert.status === "waiting-approval"
                                ? "Click to view details"
                                : undefined
                            }
                          >
                            {advert.title}
                            {(advert.status === "published" ||
                              advert.status === "vip" ||
                              advert.status === "vip-prime" ||
                              advert.status === "waiting-approval") && (
                              <span className="ml-2 text-xs text-gray-500">
                                (click to view)
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {advert.description}
                          </p>

                          {/* Location and Date */}
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{advert.location}</span>
                            </div>
                            <div className="flex items-center space-x-1"></div>
                          </div>
                        </div>

                        {/* Status Badge and Action Buttons */}
                        <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                          {getStatusBadge(advert.status)}

                          {/* Edit button - available for all ads */}
                          <button
                            onClick={() =>
                              navigate(`/profile/post-ads?edit=${advert.id}`)
                            }
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Advertisement"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {/* View button - for published and waiting approval ads */}
                          {(advert.status === "published" ||
                            advert.status === "vip" ||
                            advert.status === "vip-prime" ||
                            advert.status === "waiting-approval") && (
                            <button
                              onClick={() => setViewingAd(advert)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                              title="View Advertisement Details"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
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
          <button className="px-3 py-2 bg-blue-500 text-white rounded-lg">
            1
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
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
      </div>

      {/* Plans Modal */}
      {showPlansModal && <PlansModal />}

      {/* View Ad Modal */}
      {viewingAd && (
        <ViewAdModal ad={viewingAd} onClose={() => setViewingAd(null)} />
      )}
    </div>
  );
};

export default YourAdverts;
