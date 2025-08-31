import React from "react";

const OrderHistory: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Order History
          </h1>
        </div>

        {/* Order Cards */}
        <div className="space-y-4">
          {/* Order 1 - VIP Prime 1 Month */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-600 font-medium text-lg">1.</span>
                  <h3 className="text-blue-600 font-medium text-lg">
                    Title of the your first ads
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>UPI id : #1548521544</div>
                  <div>Plan : VIP Prime (1 month)</div>
                  <div>date & time : 25.08.2025 , 12:00 pm</div>
                </div>
              </div>
              <div className="ml-4">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  VIP PRIME
                </span>
              </div>
            </div>
          </div>

          {/* Order 2 - VIP 24 Hours */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-600 font-medium text-lg">2.</span>
                  <h3 className="text-blue-600 font-medium text-lg">
                    Title of the your first ads
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>UPI id : #1548521544</div>
                  <div>Plan : VIP (24 hours)</div>
                  <div>date & time : 25.08.2025 , 12:00 pm</div>
                </div>
              </div>
              <div className="ml-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  VIP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
