import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import {
  getUserAdvertisements,
  Advertisement,
  publishDraftAdvertisement,
} from "../services/advertisementService";

const YourAdverts: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState<{
    drafts: Advertisement[];
    published: Advertisement[];
  }>({
    drafts: [],
    published: [],
  });
  const [loading, setLoading] = useState(true);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [publishingDraft, setPublishingDraft] = useState<Advertisement | null>(
    null
  );
  const [billingPeriod, setBillingPeriod] = useState<"month" | "day">("day");

  // Fetch user's advertisements from Firebase
  useEffect(() => {
    const fetchAds = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const userAds = await getUserAdvertisements(user.id);
          setAds(userAds);
        } catch (error) {
          console.error("Error fetching advertisements:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAds();
  }, [user]);

  const handlePublishDraft = (draft: Advertisement) => {
    setPublishingDraft(draft);
    setShowPlansModal(true);
  };

  const handlePlanSelection = async (plan: {
    tag: "free" | "vip" | "vip-prime";
    planDuration: number;
    planUnit: "Day";
  }) => {
    if (!publishingDraft) return;

    try {
      if (plan.tag === "free") {
        // For Free Plan, publish directly without payment
        setLoading(true);
        await publishDraftAdvertisement(publishingDraft.id!, plan);

        // Refresh the ads list to reflect the changes
        if (user?.id) {
          const userAds = await getUserAdvertisements(user.id);
          setAds(userAds);
        }

        // Close modal and show success
        setShowPlansModal(false);
        setPublishingDraft(null);

        // Optional: Show success notification
        alert("Your ad has been published successfully!");
      } else {
        // For VIP and VIP Prime plans, redirect to payment page
        let planPrice = "0";
        if (plan.tag === "vip") {
          planPrice = billingPeriod === "month" ? "40" : "3";
        } else if (plan.tag === "vip-prime") {
          planPrice = billingPeriod === "month" ? "80" : "6";
        }

        const queryParams = new URLSearchParams({
          plan: plan.tag,
          period: billingPeriod,
          price: planPrice,
          adId: publishingDraft.id!,
        });

        navigate(`/profile/payment?${queryParams.toString()}`);

        // Close the modal
        setShowPlansModal(false);
        setPublishingDraft(null);
      }
    } catch (error) {
      console.error("Error handling plan selection:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PlansModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div className="relative bg-white rounded-lg p-6 w-full max-w-7xl max-h-screen flex flex-col">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Publishing your ad...</p>
              </div>
            </div>
          )}

          <div className="text-center mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold mb-4">Select Your Plan</h2>
            <p className="text-gray-600">
              Choose a plan to publish your advertisement
            </p>
          </div>

          {/* Period Toggle */}
          <div className="flex justify-center space-x-2 mb-6 flex-shrink-0">
            <button
              onClick={() => setBillingPeriod("month")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                billingPeriod === "month"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              1 Month
            </button>
            <button
              onClick={() => setBillingPeriod("day")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                billingPeriod === "day"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              1 Day (24 hours)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 flex-1 min-h-0">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-center mb-3">
                <div className="bg-gray-500 text-white px-3 py-1 rounded text-sm inline-block mb-2">
                  Free
                </div>
                <div className="text-2xl font-bold text-gray-600 mb-1">$0</div>
                <div className="text-gray-600 text-sm">/ Forever</div>
                <div className="text-green-600 text-xs font-medium mt-1">
                  ✓ Publishes Immediately
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                  <span>
                    <strong>Placement:</strong> Basic Listings
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                  <span>
                    <strong>Highlight:</strong> Standard Ad Card Display
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                  <span>
                    <strong>Exposure:</strong> Standard Visibility
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                  <span>
                    <strong>Duration:</strong> No Time Limit
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  handlePlanSelection({
                    tag: "free",
                    planDuration: 30,
                    planUnit: "Day",
                  })
                }
                disabled={loading}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Publishing..." : "Publish Free Ad"}
              </button>
            </div>

            {/* VIP Plan */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="text-center mb-3">
                <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm inline-block mb-2">
                  VIP
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ${billingPeriod === "month" ? "40" : "3"}
                </div>
                <div className="text-gray-600 text-sm">
                  / {billingPeriod === "month" ? "Month" : "Day"}
                </div>
                <div className="text-blue-600 text-xs font-medium mt-1">
                  💳 Payment Required
                </div>
              </div>

              <div className="space-y-2 mb-4">
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
                    VIP Tag/Badge
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>
                    <strong>Exposure:</strong> 3X More Visibility Than
                    Free/Normal Ads
                  </span>
                </div>
                {billingPeriod === "day" && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>
                      <strong>Duration:</strong> 24-hour premium exposure
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  handlePlanSelection({
                    tag: "vip",
                    planDuration: billingPeriod === "month" ? 30 : 1,
                    planUnit: "Day",
                  })
                }
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Proceed to Payment
              </button>
            </div>

            {/* VIP Prime Plan */}
            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <div className="text-center mb-3">
                <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm inline-block mb-2">
                  VIP Prime
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  ${billingPeriod === "month" ? "80" : "6"}
                </div>
                <div className="text-gray-600 text-sm">
                  / {billingPeriod === "month" ? "Month" : "Day"}
                </div>
                <div className="text-orange-600 text-xs font-medium mt-1">
                  💳 Payment Required
                </div>
              </div>

              <div className="space-y-2 mb-4">
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
                    <strong>Exposure:</strong> 5X More Visibility Than Normal
                    Ads
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span>
                    <strong>Rotation:</strong> Auto Rotated Randomly If There
                    Are Multiple VIP Prime Drivers
                  </span>
                </div>
                {billingPeriod === "day" && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span>
                      <strong>Duration:</strong> 24-hour premium priority
                      exposure
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  handlePlanSelection({
                    tag: "vip-prime",
                    planDuration: billingPeriod === "month" ? 30 : 1,
                    planUnit: "Day",
                  })
                }
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                Proceed to Payment
              </button>
            </div>
          </div>

          <div className="text-center flex-shrink-0">
            <button
              onClick={() => {
                setShowPlansModal(false);
                setPublishingDraft(null);
              }}
              className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your advertisements...</p>
          </div>
        ) : (
          <>
            {/* Draft Ads Section */}
            {ads.drafts.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Draft Advertisements ({ads.drafts.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    These ads are saved as drafts. Click "Publish" to make them
                    live.
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {ads.drafts.map((ad) => (
                    <div key={ad.id} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {ad.photoUrls && ad.photoUrls.length > 0 ? (
                            <img
                              src={ad.photoUrls[0]}
                              alt={ad.title}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-gray-400"
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

                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-grow">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {ad.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {ad.description}
                              </p>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {ad.city}, {ad.state}
                                </span>
                                <span className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
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
                                  {ad.phoneNumber}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                  DRAFT
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                  {ad.category}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
                              <Link
                                to={`/profile/post-ads?edit=${ad.id}`}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handlePublishDraft(ad)}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Publish
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Ads Section */}
            {ads.published.filter((ad) => ad.status === "pending").length >
              0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-yellow-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pending Approval (
                    {
                      ads.published.filter((ad) => ad.status === "pending")
                        .length
                    }
                    )
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    These ads are waiting for admin approval. VIP and VIP Prime
                    ads require approval before going live.
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {ads.published
                    .filter((ad) => ad.status === "pending")
                    .map((ad) => (
                      <div key={ad.id} className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            {ad.photoUrls && ad.photoUrls.length > 0 ? (
                              <img
                                src={ad.photoUrls[0]}
                                alt={ad.title}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
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

                          {/* Content */}
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {ad.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                  {ad.description}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                  <span className="flex items-center">
                                    📍 {ad.city}, {ad.state}
                                  </span>
                                  <span className="flex items-center">
                                    📞 {ad.phoneNumber}
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                                    PENDING APPROVAL
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      ad.tag === "vip-prime"
                                        ? "bg-orange-100 text-orange-800"
                                        : ad.tag === "vip"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {ad.tag === "vip-prime"
                                      ? "VIP PRIME"
                                      : ad.tag === "vip"
                                      ? "VIP"
                                      : "FREE"}
                                    {ad.tag &&
                                      ad.tag !== "free" &&
                                      ad.planDuration && (
                                        <span className="font-normal">
                                          {" "}
                                          • {ad.planDuration}{" "}
                                          {ad.planDuration === 1
                                            ? "Day"
                                            : "Days"}
                                        </span>
                                      )}
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                    {ad.category}
                                  </span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
                                <div className="flex items-center text-yellow-600">
                                  <svg
                                    className="w-5 h-5 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium">
                                    Awaiting Approval
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Rejected Ads Section */}
            {ads.published.filter((ad) => ad.status === "rejected").length >
              0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-red-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Rejected Advertisements (
                    {
                      ads.published.filter((ad) => ad.status === "rejected")
                        .length
                    }
                    )
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    These ads were not approved by admin. You can edit and
                    resubmit them.
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {ads.published
                    .filter((ad) => ad.status === "rejected")
                    .map((ad) => (
                      <div key={ad.id} className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            {ad.photoUrls && ad.photoUrls.length > 0 ? (
                              <img
                                src={ad.photoUrls[0]}
                                alt={ad.title}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {ad.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                  {ad.description}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                  <span className="flex items-center">
                                    📍 {ad.city}, {ad.state}
                                  </span>
                                  <span className="flex items-center">
                                    📞 {ad.phoneNumber}
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                    REJECTED
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      ad.tag === "vip-prime"
                                        ? "bg-orange-100 text-orange-800"
                                        : ad.tag === "vip"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {ad.tag === "vip-prime"
                                      ? "VIP PRIME"
                                      : ad.tag === "vip"
                                      ? "VIP"
                                      : "FREE"}
                                    {ad.tag &&
                                      ad.tag !== "free" &&
                                      ad.planDuration && (
                                        <span className="font-normal">
                                          {" "}
                                          • {ad.planDuration}{" "}
                                          {ad.planDuration === 1
                                            ? "Day"
                                            : "Days"}
                                        </span>
                                      )}
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                    {ad.category}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
                                <Link
                                  to={`/profile/post-ads?edit=${ad.id}`}
                                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Edit & Resubmit
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Published Ads Section */}
            {ads.published.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Published Advertisements (
                    {
                      ads.published.filter(
                        (ad) =>
                          ad.status === "approved" || ad.status === "published"
                      ).length
                    }
                    )
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    These ads are live and visible to users.
                  </p>
                </div>
                <div className="space-y-6 p-6">
                  {ads.published
                    .filter(
                      (ad) =>
                        ad.status === "approved" || ad.status === "published"
                    )
                    .map((ad) => {
                      // Get styling based on ad tag
                      const getAdStyling = (tag: string) => {
                        if (tag === "vip-prime") {
                          return {
                            containerClass: "relative",
                            frameClass:
                              "bg-white rounded-3xl border-2 border-gray-200 shadow-2xl",
                            backgroundClass: "p-8",
                            gradientBg:
                              "linear-gradient(145deg, #ffffff 0%, #fefce8 100%)",
                            ringClass: "ring-4 ring-amber-300",
                            textClass: "text-amber-900 drop-shadow-sm",
                          };
                        }
                        if (tag === "vip") {
                          return {
                            containerClass: "relative",
                            frameClass:
                              "bg-white rounded-3xl border-2 border-gray-200 shadow-xl",
                            backgroundClass: "p-8",
                            gradientBg:
                              "linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)",
                            ringClass: "ring-4 ring-purple-300",
                            textClass: "text-purple-900",
                          };
                        }
                        return {
                          containerClass: "relative",
                          frameClass:
                            "bg-white rounded-3xl border-2 border-gray-300 shadow-lg",
                          backgroundClass: "p-8",
                          gradientBg:
                            "linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)",
                          ringClass: "ring-4 ring-sky-200",
                          textClass: "text-gray-900",
                        };
                      };

                      const styling = getAdStyling(ad.tag || "free");

                      // Get premium badge
                      const getPremiumBadge = (tag: string) => {
                        if (tag === "vip-prime") {
                          return (
                            <div className="absolute -top-0 left-1/2 -translate-x-1/2 lg:right-4 lg:left-auto lg:translate-x-0 z-30">
                              <div className="relative inline-flex items-center gap-2 px-4 py-2">
                                <div className="flex items-center gap-1 text-yellow-900 font-black tracking-wider transition-all duration-300 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 border-2 border-yellow-500 shadow-lg hover:shadow-xl hover:shadow-yellow-400/50 px-3 py-1 rounded-full">
                                  <svg
                                    className="h-3 w-3 text-yellow-800 filter drop-shadow-sm"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-[10px] uppercase font-black">
                                    VIP PRIME
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        if (tag === "vip") {
                          return (
                            <div className="absolute -top-0 left-1/2 -translate-x-1/2 lg:right-4 lg:left-auto lg:translate-x-0 z-30">
                              <div className="relative inline-flex items-center gap-2 px-4 py-2">
                                <div className="flex items-center gap-1 text-purple-900 font-bold tracking-wide bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 border-2 border-purple-600 shadow-lg px-3 py-1 rounded-full text-white">
                                  <svg
                                    className="h-3 w-3 filter drop-shadow-sm"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-[10px] uppercase font-bold">
                                    VIP
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      };

                      return (
                        <div key={ad.id} className={styling.containerClass}>
                          {/* Premium Badge */}
                          {getPremiumBadge(ad.tag || "free")}

                          {/* Main Card with Frame Border */}
                          <div
                            className={styling.frameClass}
                            style={{ background: styling.gradientBg }}
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
                                    {(!ad.tag || ad.tag === "free") && (
                                      <div className="absolute -inset-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 rounded-xl blur-sm opacity-20"></div>
                                    )}

                                    {ad.photoUrls && ad.photoUrls.length > 0 ? (
                                      <img
                                        src={ad.photoUrls[0]}
                                        alt={ad.title}
                                        className={`relative w-32 h-32 rounded-xl object-cover shadow-lg ${styling.ringClass}`}
                                      />
                                    ) : (
                                      <div
                                        className={`relative w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center shadow-lg ${styling.ringClass}`}
                                      >
                                        <svg
                                          className="w-8 h-8 text-gray-400"
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
                                  <div className="flex-1 space-y-4 text-center sm:text-left">
                                    {/* Title with Premium Styling */}
                                    <h3
                                      className={`text-2xl font-bold leading-tight ${styling.textClass}`}
                                    >
                                      {ad.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-700 leading-relaxed">
                                      {ad.description}
                                    </p>

                                    {/* Location and Contact */}
                                    <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
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
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                        </svg>
                                        <span>
                                          {ad.city}, {ad.state}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
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
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                          />
                                        </svg>
                                        <span>{ad.phoneNumber}</span>
                                      </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                        {ad.category}
                                      </span>
                                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        LIVE
                                      </span>
                                      {/* Plan Type and Duration */}
                                      {ad.tag && ad.tag !== "free" && (
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                            ad.tag === "vip-prime"
                                              ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200"
                                              : "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200"
                                          }`}
                                        >
                                          {ad.tag === "vip-prime" ? (
                                            <svg
                                              className="w-3 h-3"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          ) : (
                                            <svg
                                              className="w-3 h-3"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          )}
                                          {ad.tag === "vip-prime"
                                            ? "VIP PRIME"
                                            : "VIP"}{" "}
                                          • {ad.planDuration || 1}{" "}
                                          {ad.planDuration === 1
                                            ? "Day"
                                            : "Days"}
                                        </span>
                                      )}
                                      {/* Free Plan Tag */}
                                      {(!ad.tag || ad.tag === "free") && (
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                          FREE PLAN
                                        </span>
                                      )}
                                      {/* Expiry Information for VIP/VIP Prime ads */}
                                      {ad.tag &&
                                        ad.tag !== "free" &&
                                        ad.expiryDate && (
                                          <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <svg
                                              className="w-3 h-3"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                              />
                                            </svg>
                                            Expires:{" "}
                                            {ad.expiryDate.toLocaleDateString(
                                              "en-US",
                                              {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                              }
                                            )}
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 sm:min-w-[140px]">
                                  <Link
                                    to={`/profile/post-ads?edit=${ad.id}`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                                  >
                                    Edit Ad
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {ads.drafts.length === 0 && ads.published.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
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
            )}
          </>
        )}
      </div>

      {/* Plans Modal */}
      {showPlansModal && <PlansModal />}
    </div>
  );
};

export default YourAdverts;
