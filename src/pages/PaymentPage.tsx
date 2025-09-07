import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  doc,
  serverTimestamp,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { getPaymentQRCode, QRCodeData } from "../services/paymentService";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [upiTransaction, setUpiTransaction] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [loadingQRCode, setLoadingQRCode] = useState(true);

  // Get plan details and ad ID from URL parameters
  const planType = searchParams.get("plan") || "vip";
  const billingPeriod = searchParams.get("period") || "day";
  const price = searchParams.get("price") || "3";
  const adId = searchParams.get("adId");

  // Load QR code data
  const loadQRCodeData = async () => {
    try {
      setLoadingQRCode(true);
      const data = await getPaymentQRCode();
      setQrCodeData(data);
    } catch (error) {
      console.error("Error loading QR code:", error);
    } finally {
      setLoadingQRCode(false);
    }
  };

  // Redirect if no ad ID is provided and load QR code data
  useEffect(() => {
    console.log("PaymentPage - URL search params:", searchParams.toString());
    console.log("PaymentPage - adId from params:", adId);
    console.log("PaymentPage - planType from params:", planType);
    console.log("PaymentPage - price from params:", price);

    if (!adId) {
      console.log("PaymentPage - No adId found, redirecting...");
      navigate("/profile/your-adverts");
    }

    // Load QR code data
    loadQRCodeData();
  }, [adId, navigate, searchParams, planType, price]);

  const handleVerify = async () => {
    if (!paymentMode.trim() || !upiTransaction.trim()) {
      alert("Please fill in both payment mode and UPI transaction details.");
      return;
    }

    if (!adId || !user?.id) {
      alert("Missing advertisement or user information. Please try again.");
      return;
    }

    setIsProcessing(true);

    console.log("Starting payment verification...");
    console.log("Ad ID:", adId);
    console.log("User ID:", user?.id);
    console.log("Plan Type:", planType);

    try {
      // Calculate expiry date based on plan
      const now = new Date();
      const expiryDate = new Date(now);
      if (planType === "free") {
        // Free plan - 30 days
        expiryDate.setDate(now.getDate() + 30);
      } else {
        // VIP and VIP Prime - 1 day
        expiryDate.setDate(now.getDate() + 1);
      }

      console.log("Calculated expiry date:", expiryDate);

      // Step 1: Get the draft from advertisements collection
      console.log("Getting draft from advertisements collection");
      const draftRef = doc(db, "advertisements", adId);
      const draftSnap = await getDoc(draftRef);

      if (!draftSnap.exists()) {
        console.error(
          "Draft document does not exist in advertisements collection"
        );
        console.error("Document path:", draftRef.path);
        alert(
          "Advertisement draft not found. Please try again or contact support."
        );
        return;
      }

      console.log("Draft found, proceeding with publishing");
      const draftData = draftSnap.data();

      // Step 2: Create published ad in adData collection with payment info
      const publishedAdData = {
        ...draftData,
        status: planType === "free" ? "approved" : "pending", // Free ads approved immediately, VIP/VIP Prime pending
        approved: planType === "free" ? true : false, // Free ads approved, VIP/VIP Prime need admin approval
        tag:
          planType === "vip-prime"
            ? "vip-prime"
            : planType === "vip"
            ? "vip"
            : "free",
        publishedAt: serverTimestamp(),
        planDuration: planType === "free" ? 30 : 1,
        planUnit: "Day",
        expiryDate: expiryDate,
        transactionId: upiTransaction.trim(),
        paymentMode: paymentMode.trim(),
        updatedAt: serverTimestamp(),
      };

      console.log("Publishing ad to adData collection");
      const publishedAdRef = await addDoc(
        collection(db, "adData"),
        publishedAdData
      );
      console.log("Published ad created with ID:", publishedAdRef.id);

      // Step 3: Delete the draft from advertisements collection
      console.log("Deleting draft from advertisements collection");
      await deleteDoc(draftRef);
      console.log("Draft deleted successfully");

      alert(
        planType === "free"
          ? "Payment verified successfully! Your advertisement is now live and visible to users."
          : "Payment verified successfully! Your advertisement is now pending admin approval and will be live once approved."
      );
      navigate("/profile/your-adverts");
    } catch (error) {
      console.error("Detailed error:", error);

      // More specific error messages based on Firebase error codes
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        // Check for specific Firebase error codes
        const firebaseError = error as { code?: string; message?: string };

        if (firebaseError.code === "not-found") {
          alert(
            "Advertisement not found. Please try again or contact support."
          );
        } else if (firebaseError.code === "permission-denied") {
          alert(
            "Permission denied. You may not have access to update this advertisement."
          );
        } else {
          alert(
            `Failed to process payment: ${error.message}. Please try again.`
          );
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setPaymentMode("");
    setUpiTransaction("");
  };

  const getPlanDisplayName = () => {
    return planType === "vip-prime" ? "VIP Prime" : "VIP";
  };

  const formatLastUpdated = (
    timestamp: string | Date | { toDate: () => Date } | null | undefined
  ) => {
    if (!timestamp) return "Never updated";

    try {
      let date: Date;

      if (
        timestamp &&
        typeof timestamp === "object" &&
        "toDate" in timestamp &&
        typeof timestamp.toDate === "function"
      ) {
        // Firestore Timestamp
        date = timestamp.toDate();
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        return "Never updated";
      }

      return `Last updated: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    } catch {
      return "Never updated";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-blue-600">TAXI NEAR ME</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Plan Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Selected Plan: {getPlanDisplayName()}
          </h2>
          <p className="text-2xl font-bold text-blue-600">
            ${price} / {billingPeriod === "month" ? "Month" : "Day"}
          </p>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Scan QR Code for Payment
        </h3>

        {loadingQRCode ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading QR Code...</span>
          </div>
        ) : qrCodeData ? (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-6 rounded-lg">
                <img
                  src={qrCodeData.qrCodeUrl}
                  alt="Payment QR Code"
                  className="w-64 h-64 object-contain"
                  onError={(e) => {
                    // Fallback to a placeholder QR code image
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY5NzI4MCIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlBheW1lbnQgUVIgQ29kZTwvdGV4dD48L3N2Zz4=";
                  }}
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {qrCodeData.bankName}
              </p>
              <p className="text-sm text-gray-600">
                UPI ID: {qrCodeData.upiId}
              </p>
              <p className="text-xs text-gray-500">
                {formatLastUpdated(qrCodeData.lastUpdated)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 p-6 rounded-lg mb-4 mx-auto w-64 h-64 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="h-16 w-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500">QR Code not available</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Please contact admin to set up payment QR code
            </p>
          </div>
        )}
      </div>

      {/* Payment Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-900 mb-2">
            Kindly send screenshot on Whatsapp to this number
          </p>
          <a
            href="tel:12345678909"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            12345678909
          </a>
        </div>

        <div className="space-y-6">
          {/* Payment Mode */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Payment Mode
            </label>
            <input
              type="text"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              placeholder="Enter payment mode (e.g., UPI, Credit Card, Net Banking)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* UPI Transaction */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              UPI Transaction ID
            </label>
            <input
              type="text"
              value={upiTransaction}
              onChange={(e) => setUpiTransaction(e.target.value)}
              placeholder="Enter UPI transaction ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Clear
        </button>
        <button
          onClick={handleVerify}
          disabled={isProcessing}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
