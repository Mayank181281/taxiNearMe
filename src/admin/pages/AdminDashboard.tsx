import React, { useState } from "react";
import { useAdminAuth } from "../contexts/useAdminAuth";
import AdManagement from "./AdManagement";
import UserManagement from "./UserManagement";
import QRCodeManagement from "./QRCodeManagement";
import AdExpirationManager from "../components/AdExpirationManager";
import { useAdminExpiration } from "../../hooks/useAutoExpiration";
import WatermarkPreview from "../../components/WatermarkPreview";

type ActivePage = "users" | "ads" | "payments" | "expiration" | "watermark";

const AdminDashboard: React.FC = () => {
  // Process expired ads in admin panel for real-time data
  useAdminExpiration();

  const [activePage, setActivePage] = useState<ActivePage>("users");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAdminAuth();

  const navigation = [
    {
      id: "users" as ActivePage,
      name: "User Management",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      id: "ads" as ActivePage,
      name: "Ad Management",
      icon: (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: "payments" as ActivePage,
      name: "Payment Management",
      icon: (
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "expiration" as ActivePage,
      name: "Ad Expiration",
      icon: (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "watermark" as ActivePage,
      name: "Watermark Settings",
      icon: (
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activePage) {
      case "users":
        return <UserManagement />;
      case "ads":
        return <AdManagement />;
      case "payments":
        return <QRCodeManagement />;
      case "expiration":
        return <AdExpirationManager />;
      case "watermark":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Watermark Management
              </h1>
              <p className="text-gray-600">
                Manage automatic watermarking for uploaded advertisement images.
              </p>
            </div>
            
            <WatermarkPreview />
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Watermark Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Automatic Watermarking</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✓ Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Watermark Text</span>
                  <span className="text-gray-900 font-medium">TAXI NEAR ME</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Opacity</span>
                  <span className="text-gray-900 font-medium">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Position</span>
                  <span className="text-gray-900 font-medium">Center (Multiple)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Minimum Size</span>
                  <span className="text-gray-900 font-medium">300x300 pixels</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-800">
                TaxiAdmin
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                activePage === item.id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {navigation.find((nav) => nav.id === activePage)?.name}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, Admin</div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
