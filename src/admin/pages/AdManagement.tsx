import React, { useState, useEffect } from "react";
import {
  getAllAdvertisementsForAdmin,
  approveAdvertisement,
  rejectAdvertisement,
  deleteAdvertisementFromAdmin,
  AdminAdvertisement,
} from "../../services/adminService";

const AdManagement: React.FC = () => {
  const [ads, setAds] = useState<AdminAdvertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [selectedAd, setSelectedAd] = useState<AdminAdvertisement | null>(null);
  const [deletingAd, setDeletingAd] = useState<AdminAdvertisement | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch advertisements from Firebase
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const adsData = await getAllAdvertisementsForAdmin();
      setAds(adsData);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveAdvertisement(id);
      // Update local state
      setAds(
        ads.map((ad) =>
          ad.id === id ? { ...ad, status: "approved" as const } : ad
        )
      );
      // Close modal if the approved ad was selected
      if (selectedAd?.id === id) {
        setSelectedAd({ ...selectedAd, status: "approved" });
      }
    } catch (error) {
      console.error("Error approving ad:", error);
      alert("Failed to approve advertisement. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAdvertisement(id);
      // Update local state
      setAds(
        ads.map((ad) =>
          ad.id === id ? { ...ad, status: "rejected" as const } : ad
        )
      );
      // Close modal if the rejected ad was selected
      if (selectedAd?.id === id) {
        setSelectedAd({ ...selectedAd, status: "rejected" });
      }
    } catch (error) {
      console.error("Error rejecting ad:", error);
      alert("Failed to reject advertisement. Please try again.");
    }
  };

  const handleDelete = (ad: AdminAdvertisement) => {
    setDeletingAd(ad);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!deletingAd) return;

    try {
      setLoading(true);
      await deleteAdvertisementFromAdmin(deletingAd.id);

      // Remove from local state
      setAds(ads.filter((ad) => ad.id !== deletingAd.id));

      // Close modal if the deleted ad was selected
      if (selectedAd?.id === deletingAd.id) {
        setSelectedAd(null);
      }

      // Close confirmation dialog
      setShowDeleteConfirmation(false);
      setDeletingAd(null);

      alert("Advertisement deleted successfully!");
    } catch (error) {
      console.error("Error deleting ad:", error);
      alert("Failed to delete advertisement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeletingAd(null);
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

  const filteredAds = ads.filter((ad) => {
    const matchesStatus = filter === "all" || ad.status === filter;
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      ad.customerEmail.toLowerCase().includes(searchLower) ||
      (ad.transactionId &&
        ad.transactionId.toLowerCase().includes(searchLower)) ||
      ad.id.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading advertisements...</p>
        </div>
      ) : (
        <>
          {/* Header and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Advertisement Management
              </h2>
              <p className="text-gray-600">
                Review and manage submitted advertisements ({ads.length} total)
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by email, UPI ID, or Ad ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
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
                        `(${
                          ads.filter((ad) => ad.status === "pending").length
                        })`}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Search Results Info */}
            {(searchTerm || filter !== "all") && (
              <div className="text-sm text-gray-600">
                Showing {filteredAds.length} of {ads.length} ads
                {searchTerm && (
                  <span className="ml-1">matching "{searchTerm}"</span>
                )}
              </div>
            )}
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
                <div className="text-2xl font-bold text-gray-900">
                  {stat.count}
                </div>
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
                      Customer Email & Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UPI ID
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
                    <tr
                      key={ad.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {ad.customerEmail}
                          </div>
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {ad.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">
                          {ad.id.substring(0, 12)}...
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Click for full ID
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ad.transactionId ? (
                          <div className="max-w-xs">
                            <div
                              className="font-mono text-xs bg-gray-100 px-2 py-1 rounded truncate"
                              title={ad.transactionId}
                            >
                              {ad.transactionId}
                            </div>
                            {ad.paymentMode && (
                              <div className="text-xs text-gray-500 mt-1">
                                {ad.paymentMode}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            {ad.tag === "free"
                              ? "Free Plan"
                              : "No Payment Info"}
                          </span>
                        )}
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
                        <button
                          onClick={() => handleDelete(ad)}
                          className="text-red-600 hover:text-red-800 transition-colors font-medium"
                        >
                          Delete
                        </button>
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
                  {searchTerm
                    ? "No advertisements found"
                    : "No advertisements match the current filters"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? `No advertisements found matching "${searchTerm}". Try searching with a different email, UPI ID, or Ad ID.`
                    : "No advertisements match the current filter criteria."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear search
                  </button>
                )}
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
                        Customer Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAd.customerEmail}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Advertisement ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono text-xs break-all">
                        {selectedAd.id}
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
                          {new Date(
                            selectedAd.submittedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Payment Information */}
                    {(selectedAd.paymentMode || selectedAd.transactionId) &&
                      selectedAd.tag !== "free" && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Payment Information
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {selectedAd.paymentMode && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600">
                                  Payment Mode
                                </label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                                  {selectedAd.paymentMode}
                                </p>
                              </div>
                            )}
                            {selectedAd.transactionId && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600">
                                  UPI Transaction ID
                                </label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded font-mono break-all">
                                  {selectedAd.transactionId}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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

                  <div className="flex justify-between mt-6 pt-6 border-t">
                    <button
                      onClick={() => handleDelete(selectedAd)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Advertisement
                    </button>
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
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Delete
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this advertisement? This
                  action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
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
