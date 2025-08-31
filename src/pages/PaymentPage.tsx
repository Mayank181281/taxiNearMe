import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [upiTransaction, setUpiTransaction] = useState<string>("");

  // Get plan details from URL parameters
  const planType = searchParams.get("plan") || "vip";
  const billingPeriod = searchParams.get("period") || "month";
  const price = searchParams.get("price") || "40";

  const handleVerify = () => {
    if (paymentMode.trim() && upiTransaction.trim()) {
      // Here you would typically send the payment details to your server
      alert(
        "Payment details submitted successfully! Your ad will be reviewed and activated soon."
      );
      navigate("/profile/your-adverts");
    } else {
      alert("Please fill in both payment mode and UPI transaction details.");
    }
  };

  const handleClear = () => {
    setPaymentMode("");
    setUpiTransaction("");
  };

  const getPlanDisplayName = () => {
    return planType === "vip-prime" ? "VIP Prime" : "VIP";
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
          Scan QR
        </h3>

        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-6 rounded-lg">
            <img
              src="/images/qr-code-payment.png"
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
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
