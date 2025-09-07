import React, { useState } from "react";
import { initializeAdminData } from "../../services/seedData";

const Dashboard: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeData = async () => {
    if (
      window.confirm("This will create sample users for testing. Continue?")
    ) {
      setIsInitializing(true);
      try {
        await initializeAdminData();
        alert("Sample data created successfully!");
      } catch (error) {
        console.error("Error initializing data:", error);
        alert("Error creating sample data. Please check console for details.");
      } finally {
        setIsInitializing(false);
      }
    }
  };

  // Dummy data for the chart (user signups over the last week)
  const weeklySignups = [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 19 },
    { day: "Wed", count: 8 },
    { day: "Thu", count: 15 },
    { day: "Fri", count: 22 },
    { day: "Sat", count: 28 },
    { day: "Sun", count: 17 },
  ];

  const maxSignups = Math.max(...weeklySignups.map((day) => day.count));

  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      changeType: "positive",
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
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
      ),
    },
    {
      title: "Active Drivers",
      value: "1,264",
      change: "+8.2%",
      changeType: "positive",
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Pending Ads",
      value: "47",
      change: "-2.1%",
      changeType: "negative",
      icon: (
        <svg
          className="w-8 h-8 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Monthly Revenue",
      value: "$18,642",
      change: "+15.3%",
      changeType: "positive",
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Signups Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              User Signups This Week
            </h3>
            <div className="text-sm text-gray-500">Last 7 days</div>
          </div>

          <div className="space-y-4">
            {weeklySignups.map((day, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 text-sm font-medium text-gray-600">
                  {day.day}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(day.count / maxSignups) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-sm font-semibold text-gray-900 text-right">
                  {day.count}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Total signups this week:{" "}
              <span className="font-semibold text-gray-900">121</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                action: "New driver registered",
                user: "John Smith",
                time: "2 minutes ago",
                type: "user",
              },
              {
                action: "Advertisement approved",
                user: "Premium Taxi Service",
                time: "15 minutes ago",
                type: "ad",
              },
              {
                action: "Payment received",
                user: "Mike Johnson",
                time: "1 hour ago",
                type: "payment",
              },
              {
                action: "New advertisement submitted",
                user: "City Cab Services",
                time: "2 hours ago",
                type: "ad",
              },
              {
                action: "Driver profile updated",
                user: "Sarah Wilson",
                time: "3 hours ago",
                type: "user",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "user"
                      ? "bg-blue-500"
                      : activity.type === "ad"
                      ? "bg-green-500"
                      : "bg-purple-500"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> -{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: "Review Pending Ads",
              count: 47,
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              name: "New User Requests",
              count: 12,
              color: "bg-blue-100 text-blue-800",
            },
            {
              name: "Payment Issues",
              count: 3,
              color: "bg-red-100 text-red-800",
            },
            {
              name: "System Updates",
              count: 1,
              color: "bg-green-100 text-green-800",
            },
          ].map((action, index) => (
            <button
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {action.name}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${action.color}`}
                >
                  {action.count}
                </span>
              </div>
              <p className="text-xs text-gray-500">Click to manage</p>
            </button>
          ))}
        </div>
      </div>

      {/* Data Initialization Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Development Tools
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Initialize Sample Data
            </h4>
            <p className="text-sm text-gray-500">
              Create sample users for testing the admin panel
            </p>
          </div>
          <button
            onClick={handleInitializeData}
            disabled={isInitializing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isInitializing ? "Initializing..." : "Create Sample Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
