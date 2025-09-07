import React, { useState, useEffect } from "react";
import {
  getUsersWithAdCounts,
  updateUserStatus,
  deleteUser,
  AdminUser,
} from "../../services/userManagementService";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "suspended"
  >("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState<
    "all" | "Driver" | "Customer"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Fetch users from Firebase
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getUsersWithAdCounts();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    userId: string,
    newStatus: "active" | "inactive" | "suspended"
  ) => {
    try {
      await updateUserStatus(userId, newStatus);
      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      // Update selected user if it's the same one
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
      alert(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status. Please try again.");
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

  const getAccountTypeColor = (type: string) => {
    return type === "Driver"
      ? "bg-purple-100 text-purple-800"
      : "bg-cyan-100 text-cyan-800";
  };

  const filteredUsers = users.filter((user) => {
    const matchesStatus = filter === "all" || user.status === filter;
    const matchesAccountType =
      accountTypeFilter === "all" || user.accountType === accountTypeFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesAccountType && matchesSearch;
  });

  return (
    <div className="space-y-6">
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
                Manage and monitor registered users
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
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
            <div className="flex space-x-2">
              {(["all", "Driver", "Customer"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAccountTypeFilter(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    accountTypeFilter === type
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
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
                label: "Drivers",
                count: users.filter((u) => u.accountType === "Driver").length,
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
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sign-up Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
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
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(
                            user.accountType
                          )}`}
                        >
                          {user.accountType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                            user.subscriptionPlan
                          )}`}
                        >
                          {user.subscriptionPlan}
                        </span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          View Details
                        </button>
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
                  No users found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No users match the current filter criteria.
                </p>
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
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {selectedUser.name}
                        </h4>
                        <p className="text-gray-600">{selectedUser.email}</p>
                      </div>
                    </div>

                    {/* User Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Account Type
                        </label>
                        <span
                          className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(
                            selectedUser.accountType
                          )}`}
                        >
                          {selectedUser.accountType}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <span
                          className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
                            selectedUser.status
                          )}`}
                        >
                          {selectedUser.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Subscription Plan
                        </label>
                        <span
                          className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                            selectedUser.subscriptionPlan
                          )}`}
                        >
                          {selectedUser.subscriptionPlan}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Total Advertisements
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">
                          {selectedUser.totalAds}
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
                        onClick={() =>
                          alert("Message functionality not implemented yet")
                        }
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send Message
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedUser.id, "suspended")
                        }
                        className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Suspend Account
                      </button>
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
        </>
      )}
    </div>
  );
};

export default UserManagement;
