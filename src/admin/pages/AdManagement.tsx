import React, { useState } from "react";

interface Advertisement {
  id: string;
  customerName: string;
  title: string;
  description: string;
  subscriptionPlan: "Free" | "VIP" | "VIP Prime";
  submittedDate: string;
  location: string;
  status: "pending" | "approved" | "rejected";
}

const AdManagement: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([
    {
      id: "1",
      customerName: "John Smith",
      title: "Premium Taxi Service - Delhi to Gurgaon",
      description:
        "Professional taxi service with experienced driver. Clean car, on-time service.",
      subscriptionPlan: "VIP Prime",
      submittedDate: "2025-08-30",
      location: "Delhi, India",
      status: "pending",
    },
    {
      id: "2",
      customerName: "Maria Garcia",
      title: "Comfortable Car Rental Service",
      description:
        "Reliable car rental service for all your travel needs. Well-maintained vehicles.",
      subscriptionPlan: "VIP",
      submittedDate: "2025-08-29",
      location: "Mumbai, India",
      status: "pending",
    },
    {
      id: "3",
      customerName: "David Wilson",
      title: "Local Taxi Service - City Tours",
      description:
        "Affordable local taxi service for city tours and short distance travels.",
      subscriptionPlan: "Free",
      submittedDate: "2025-08-28",
      location: "Bangalore, India",
      status: "pending",
    },
    {
      id: "4",
      customerName: "Sarah Johnson",
      title: "Airport Transfer Service",
      description:
        "Dedicated airport transfer service. 24/7 availability with advance booking.",
      subscriptionPlan: "VIP Prime",
      submittedDate: "2025-08-27",
      location: "Gurgaon, India",
      status: "pending",
    },
    {
      id: "5",
      customerName: "Ahmed Hassan",
      title: "Economy Taxi Service",
      description:
        "Budget-friendly taxi service for daily commute. Reliable and affordable.",
      subscriptionPlan: "Free",
      submittedDate: "2025-08-26",
      location: "Chennai, India",
      status: "pending",
    },
  ]);

  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  const handleApprove = (id: string) => {
    setAds(
      ads.map((ad) =>
        ad.id === id ? { ...ad, status: "approved" as const } : ad
      )
    );
  };

  const handleReject = (id: string) => {
    setAds(
      ads.map((ad) =>
        ad.id === id ? { ...ad, status: "rejected" as const } : ad
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "VIP Prime":
        return "bg-orange-100 text-orange-800";
      case "VIP":
        return "bg-blue-100 text-blue-800";
      case "Free":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAds =
    filter === "all" ? ads : ads.filter((ad) => ad.status === filter);

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Advertisement Management
          </h2>
          <p className="text-gray-600">
            Review and manage submitted advertisements
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex space-x-2">
            {(["all", "pending", "approved", "rejected"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === status
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {status}{" "}
                  {status === "pending" &&
                    `(${ads.filter((ad) => ad.status === "pending").length})`}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Ads", count: ads.length, color: "text-blue-600" },
          {
            label: "Pending",
            count: ads.filter((ad) => ad.status === "pending").length,
            color: "text-yellow-600",
          },
          {
            label: "Approved",
            count: ads.filter((ad) => ad.status === "approved").length,
            color: "text-green-600",
          },
          {
            label: "Rejected",
            count: ads.filter((ad) => ad.status === "rejected").length,
            color: "text-red-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
            <div className={`text-sm font-medium ${stat.color}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Ads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ad.customerName}
                      </div>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {ad.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                        ad.subscriptionPlan
                      )}`}
                    >
                      {ad.subscriptionPlan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {ad.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
                        ad.status
                      )}`}
                    >
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(ad.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedAd(ad)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View
                    </button>
                    {ad.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(ad.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(ad.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAds.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No advertisements found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No advertisements match the current filter.
            </p>
          </div>
        )}
      </div>

      {/* View Ad Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Advertisement Details
                </h3>
                <button
                  onClick={() => setSelectedAd(null)}
                  className="text-gray-400 hover:text-gray-600"
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedAd.customerName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedAd.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedAd.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subscription Plan
                    </label>
                    <span
                      className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                        selectedAd.subscriptionPlan
                      )}`}
                    >
                      {selectedAd.subscriptionPlan}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
                        selectedAd.status
                      )}`}
                    >
                      {selectedAd.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedAd.location}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Submitted Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedAd.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedAd.status === "pending" && (
                <div className="flex space-x-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      handleApprove(selectedAd.id);
                      setSelectedAd(null);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedAd.id);
                      setSelectedAd(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedAd(null)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdManagement;
