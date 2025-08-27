import React from "react";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
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
              Your Adverts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Ads</span>
                <span className="text-lg font-bold text-gray-900">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="text-lg font-bold text-green-600">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inactive</span>
                <span className="text-lg font-bold text-gray-900">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Premium Ads</span>
                <span className="text-lg font-bold text-yellow-600">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Free Ads</span>
                <span className="text-lg font-bold text-gray-900">1</span>
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
                <span className="text-lg font-bold text-gray-900">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-lg font-bold text-green-600">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-lg font-bold text-orange-600">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="text-lg font-bold text-red-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Order</span>
                <span className="text-sm font-medium text-gray-900">
                  Aug 20, 2025
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
              Post your Ads (up to 4/10)
            </h2>
          </div>

          {/* Ad Listings */}
          <div className="space-y-4">
            {/* Ad 1 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    1. Title of the your first ads
                  </h3>
                  <p className="text-sm text-gray-600">
                    This is the content section of the your first ads with less
                    or summary of the content.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    Save
                  </span>
                </div>
              </div>
            </div>

            {/* Ad 2 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    2. Title of the your first ads
                  </h3>
                  <p className="text-sm text-gray-600">
                    This is the content section of the your first ads with less
                    or summary of the content.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    Live
                  </span>
                </div>
              </div>
            </div>

            {/* Ad 3 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    3. Title of the your first ads
                  </h3>
                  <p className="text-sm text-gray-600">
                    This is the content section of the your first ads with less
                    or summary of the content.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    Live
                  </span>
                </div>
              </div>
            </div>

            {/* Ad 4 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    4. Title of the your first ads
                  </h3>
                  <p className="text-sm text-gray-600">
                    This is the content section of the your first ads with less
                    or summary of the content.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Ad Button */}
          <div className="mt-6 text-center">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
