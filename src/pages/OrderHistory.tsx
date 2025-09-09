import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import {
  getUserOrderHistory,
  Advertisement,
} from "../services/advertisementService";

const OrderHistory: React.FC = () => {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's order history
  useEffect(() => {
    const fetchOrderHistory = async () => {
      const userId = firebaseUser?.uid;

      if (userId) {
        try {
          setLoading(true);
          const userOrders = await getUserOrderHistory(userId);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching order history:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [firebaseUser]);

  // Helper function to get plan display name
  const getPlanDisplayName = (order: Advertisement): string => {
    // Use originalTag if it exists (for auto-downgraded ads), otherwise use current tag
    const displayTag = order.originalTag || order.tag || "free";
    const duration = order.planDuration || 30;

    if (displayTag === "free") return "Free (30 days)";
    if (displayTag === "vip")
      return `VIP (${duration === 30 ? "1 month" : "24 hours"})`;
    if (displayTag === "vip-prime")
      return `VIP Prime (${duration === 30 ? "1 month" : "24 hours"})`;
    return "Unknown Plan";
  };

  // Helper function to get plan tag styling
  const getPlanTagStyle = (order: Advertisement) => {
    // Use originalTag if it exists (for auto-downgraded ads), otherwise use current tag
    const displayTag = order.originalTag || order.tag || "free";
    const isExpired = order.autoDowngraded;

    let baseStyle = "";
    switch (displayTag) {
      case "vip-prime":
        baseStyle = "bg-purple-600 text-white";
        break;
      case "vip":
        baseStyle = "bg-blue-500 text-white";
        break;
      case "free":
        baseStyle = "bg-gray-500 text-white";
        break;
      default:
        baseStyle = "bg-gray-500 text-white";
    }

    // Add opacity for expired premium ads
    if (isExpired) {
      baseStyle += " opacity-75";
    }

    return baseStyle;
  };

  // Helper function to get display tag text
  const getDisplayTagText = (order: Advertisement): string => {
    const displayTag = order.originalTag || order.tag || "free";
    const tagText = displayTag.toUpperCase().replace("-", " ");

    if (order.autoDowngraded) {
      return `${tagText} (Expired)`;
    }

    return tagText;
  };

  // Helper function to format date
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "N/A";
    return (
      date.toLocaleDateString("en-GB") +
      " , " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Order History
          </h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your order history...</p>
          </div>
        ) : (
          <>
            {/* Order Cards */}
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-blue-600 font-medium text-lg">
                            {index + 1}.
                          </span>
                          <h3 className="text-blue-600 font-medium text-lg">
                            {order.title}
                          </h3>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>
                            {(order.originalTag || order.tag) === "free"
                              ? "Reference: Free Plan"
                              : `UPI id : #${order.transactionId || "N/A"}`}
                          </div>
                          <div>Plan : {getPlanDisplayName(order)}</div>
                          <div>
                            date & time : {formatDate(order.publishedAt)}
                          </div>
                          {order.autoDowngraded && (
                            <div className="text-orange-600 font-medium">
                              ⚠️ This premium ad has expired and was downgraded
                              to free
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanTagStyle(
                            order
                          )}`}
                        >
                          {getDisplayTagText(order)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
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
                  No order history found
                </h3>
                <p className="mt-2 text-gray-500">
                  You haven't made any orders yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
