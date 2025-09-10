import React, { useState, useEffect } from "react";
import { deleteUser } from "../../services/userManagementService";
import {
  getEnhancedUsersData,
  EnhancedUserData,
} from "../../services/userAdService";
import UserAdsView from "../components/UserAdsView";
import QuickExpirationProcessor from "../components/QuickExpirationProcessor";
import DatabaseDiagnostic from "../components/DatabaseDiagnostic";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<EnhancedUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "suspended"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<EnhancedUserData | null>(
    null
  );
  const [showUserAds, setShowUserAds] = useState<{
    userId: string;
    userName: string;
  } | null>(null);

  // Fetch users from Firebase
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getEnhancedUsersData();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(userId);
        // Remove from local state
        setUsers(users.filter((user) => user.id !== userId));
        // Close modal if deleted user was selected
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
        }
        alert("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesStatus = filter === "all" || user.status === filter;
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Quick Fix for Expired Ads */}
      <QuickExpirationProcessor />

      {/* Database Diagnostic Tool */}
      <DatabaseDiagnostic />

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      ) : (
        <>
          {/* Header and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                User Management
              </h2>
              <p className="text-gray-600">
                Manage and monitor registered users ({users.length} total)
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
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
                      <svg
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
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex space-x-2">
                {(["all", "active", "inactive", "suspended"] as const).map(
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
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Search Results Info */}
            {(searchTerm || filter !== "all") && (
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
                {searchTerm && (
                  <span className="ml-1">matching "{searchTerm}"</span>
                )}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Users",
                count: users.length,
                color: "text-blue-600",
              },
              {
                label: "Active Users",
                count: users.filter((u) => u.status === "active").length,
                color: "text-green-600",
              },
              {
                label: "Users with Ads",
                count: users.filter((u) => u.adSummary.totalAds > 0).length,
                color: "text-purple-600",
              },
              {
                label: "Premium Users",
                count: users.filter((u) => u.subscriptionPlan !== "Free")
                  .length,
                color: "text-orange-600",
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

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ads Breakdown
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sign-up Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              ID: {user.id}
                            </div> */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email.includes("@gmail.com")
                            ? "Gmail"
                            : user.email.includes("@yahoo.com")
                            ? "Yahoo"
                            : user.email.includes("@outlook.com")
                            ? "Outlook"
                            : "Other"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            Total: {user.adSummary.totalAds}
                          </div>
                          <div className="text-xs text-gray-500 space-x-2">
                            <span className="text-orange-600">
                              VIP Prime: {user.adSummary.vipPrimeCount}
                            </span>
                            <span className="text-blue-600">
                              VIP: {user.adSummary.vipCount}
                            </span>
                            <span className="text-gray-600">
                              Free: {user.adSummary.freeCount}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.signUpDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              setShowUserAds({
                                userId: user.id,
                                userName: user.name,
                              })
                            }
                            className="text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                          >
                            View Ads
                          </button>
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-green-600 hover:text-green-800 transition-colors px-2 py-1 rounded hover:bg-green-50"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {searchTerm
                    ? "No users found"
                    : "No users match the current filters"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? `No users found matching "${searchTerm}". Try searching with a different name or email address.`
                    : "No users match the current filter criteria."}
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

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      User Details
                    </h3>
                    <button
                      onClick={() => setSelectedUser(null)}
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

                  <div className="space-y-6">
                    {/* User Profile */}
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-xl font-medium text-white">
                          {selectedUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedUser.name}
                        </h4>
                        <div className="mt-1">
                          <p className="text-gray-600 font-medium">
                            {selectedUser.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            User ID: {selectedUser.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
                            selectedUser.status
                          )}`}
                        >
                          {selectedUser.status}
                        </span>
                      </div>
                    </div>

                    {/* User Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Total Advertisements
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">
                          {selectedUser.adSummary.totalAds}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Sign-up Date
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(
                            selectedUser.signUpDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last Login
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(
                            selectedUser.lastLogin
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-6 border-t">
                      <button
                        onClick={() => handleDeleteUser(selectedUser.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Ads View Modal */}
          {showUserAds && (
            <UserAdsView
              userId={showUserAds.userId}
              userName={showUserAds.userName}
              onClose={() => setShowUserAds(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;
