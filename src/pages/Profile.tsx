import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { getUserAdsSummary } from "../services/advertisementService";

interface Advertisement {
  id?: string;
  title: string;
  description: string;
  city?: string;
  state?: string;
  status?: string;
  tag?: string;
  createdAt?: Date;
  approved?: boolean;
}

interface AdsSummary {
  totalAds: number;
  activeAds: number;
  draftAds: number;
  premiumAds: number;
  freeAds: number;
  recentAds: Advertisement[];
  canPostMore: boolean;
}

interface OrderStats {
  totalOrders: number;
  completed: number;
  pending: number;
  cancelled: number;
  lastOrderDate: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [adsSummary, setAdsSummary] = useState<AdsSummary>({
    totalAds: 0,
    activeAds: 0,
    draftAds: 0,
    premiumAds: 0,
    freeAds: 0,
    recentAds: [],
    canPostMore: true,
  });
  const [orderStats] = useState<OrderStats>({
    totalOrders: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    lastOrderDate: "N/A",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch ads summary
        const summary = await getUserAdsSummary(user.id);
        setAdsSummary(summary);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const getStatusBadge = (ad: Advertisement) => {
    if (ad.status === "draft" || !ad.status) {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
          Draft
        </span>
      );
    }
    if (ad.status === "pending") {
      return (
        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
          Pending
        </span>
      );
    }
    if (ad.status === "approved" || ad.status === "published") {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
          Live
        </span>
      );
    }
    if (ad.status === "rejected") {
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
          Rejected
        </span>
      );
    }
    return (
      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
        Unknown
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Your Adverts */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              My Adverts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Ads</span>
                <span className="text-lg font-bold text-gray-900">
                  {adsSummary.totalAds}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="text-lg font-bold text-green-600">
                  {adsSummary.activeAds}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Drafts</span>
                <span className="text-lg font-bold text-orange-600">
                  {adsSummary.draftAds}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Premium Ads</span>
                <span className="text-lg font-bold text-yellow-600">
                  {adsSummary.premiumAds}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Free Ads</span>
                <span className="text-lg font-bold text-gray-900">
                  {adsSummary.freeAds}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/profile/your-adverts"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-600 transition-colors"
              >
                View Detail
              </Link>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order History
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="text-lg font-bold text-gray-900">
                  {orderStats.totalOrders}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-lg font-bold text-green-600">
                  {orderStats.completed}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-lg font-bold text-orange-600">
                  {orderStats.pending}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="text-lg font-bold text-red-600">
                  {orderStats.cancelled}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Order</span>
                <span className="text-sm font-medium text-gray-900">
                  {orderStats.lastOrderDate}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/profile/order-history"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-600 transition-colors"
              >
                View Detail
              </Link>
            </div>
          </div>

          {/* Plans */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plans</h3>
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Manage your plans</p>
            </div>
            <div className="mt-4">
              <Link
                to="/profile/plans"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-600 transition-colors"
              >
                View Detail
              </Link>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Profile
            </h3>
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                Manage your personal information
              </p>
            </div>
            <div className="mt-4">
              <Link
                to="/profile/edit-profile"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-600 transition-colors"
              >
                View Detail
              </Link>
            </div>
          </div>
        </div>

        {/* Post Your Ads Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Post your Ads (up to {adsSummary.totalAds}/10)
            </h2>
            {!adsSummary.canPostMore && (
              <span className="text-sm text-red-600 font-medium">
                Maximum ads limit reached
              </span>
            )}
          </div>

          {/* Ad Listings */}
          <div className="space-y-4">
            {adsSummary.recentAds.length > 0 ? (
              adsSummary.recentAds.map((ad, index) => (
                <div
                  key={ad.id || index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {index + 1}. {ad.title || "Untitled Ad"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {ad.description?.length > 100
                          ? `${ad.description.substring(0, 100)}...`
                          : ad.description || "No description available"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {ad.city && ad.state
                            ? `${ad.city}, ${ad.state}`
                            : "Location not specified"}
                        </span>
                        {ad.tag && (
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              ad.tag === "vip-prime"
                                ? "bg-purple-100 text-purple-800"
                                : ad.tag === "vip"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {ad.tag === "vip-prime"
                              ? "VIP Prime"
                              : ad.tag === "vip"
                              ? "VIP"
                              : "Free"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {getStatusBadge(ad)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  You haven't posted any ads yet.
                </p>
                <p className="text-sm text-gray-400">
                  Create your first ad to get started!
                </p>
              </div>
            )}
          </div>

          {/* Add New Ad Button */}
          <div className="mt-6 text-center">
            {adsSummary.canPostMore ? (
              <Link
                to="/profile/post-ads"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Post New Ad
              </Link>
            ) : (
              <div className="inline-flex items-center px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed font-medium">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                Ad Limit Reached (10/10)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
