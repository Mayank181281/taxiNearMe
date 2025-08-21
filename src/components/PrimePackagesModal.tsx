import React, { useState } from "react";
import {
  X,
  Crown,
  Check,
  QrCode,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface PrimePackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  color: string;
}

interface PrimePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrimePackagesModal: React.FC<PrimePackagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  if (!isOpen) return null;

  const packages: PrimePackage[] = [
    {
      id: "basic",
      name: "Basic Prime",
      price: 9.99,
      duration: "month",
      color: "blue",
      features: [
        "Priority booking system",
        "10% discount on all rides",
        "Skip the queue guarantee",
        "24/7 customer support",
        "Ride history tracking",
        "Favorite drivers list",
      ],
    },
    {
      id: "standard",
      name: "Standard Prime",
      price: 19.99,
      duration: "month",
      popular: true,
      color: "orange",
      features: [
        "All Basic Prime features",
        "Free ride cancellation",
        "15% discount on all rides",
        "Premium vehicle selection",
        "Real-time ride tracking",
        "Multiple payment options",
        "Exclusive driver network",
        "Weather protection guarantee",
      ],
    },
    {
      id: "premium",
      name: "Premium Prime",
      price: 29.99,
      duration: "month",
      color: "purple",
      features: [
        "All Standard Prime features",
        "Dedicated support manager",
        "20% discount on all rides",
        "2 free rides monthly",
        "Luxury vehicle access",
        "Airport pickup priority",
        "Corporate billing options",
        "VIP customer status",
        "Concierge services",
      ],
    },
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPayment(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setPaymentScreenshot(file);
      setIsUploading(true);

      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
        setUploadComplete(true);
      }, 2000);
    }
  };

  const generateQRCodeData = (amount: number, packageName: string) => {
    // This would typically generate actual QR code data for payment
    return `upi://pay?pa=merchant@paytm&pn=TaxiService&am=${amount}&cu=USD&tn=Payment for ${packageName}`;
  };

  const getColorClasses = (
    color: string,
    variant: "bg" | "border" | "text" | "button"
  ) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
        button: "bg-orange-600 hover:bg-orange-700",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700",
      },
    };
    return colorMap[color as keyof typeof colorMap][variant];
  };

  if (showPayment && selectedPackage) {
    const pkg = packages.find((p) => p.id === selectedPackage)!;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Payment Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Complete Payment
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {/* Selected Package Summary */}
            <div
              className={`${getColorClasses(pkg.color, "bg")} ${getColorClasses(
                pkg.color,
                "border"
              )} border rounded-xl p-4 mb-6`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                <Crown
                  className={`h-5 w-5 ${getColorClasses(pkg.color, "text")}`}
                />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${pkg.price}
                <span className="text-sm font-normal">/{pkg.duration}</span>
              </p>
            </div>

            {/* QR Code Section with Amount */}
            <div className="text-center mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Scan QR Code to Pay
              </h4>
              <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-inner">
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                  <QrCode className="h-32 w-32 mx-auto text-gray-700 mb-3" />
                  <div className="text-xs text-gray-500 font-mono break-all bg-gray-50 p-2 rounded">
                    {generateQRCodeData(pkg.price, pkg.name)}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 mb-1">
                    Amount to Pay
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ${pkg.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    For {pkg.name} - {pkg.duration}ly subscription
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Scan with any UPI app (PhonePe, Paytm, GPay) or banking app
              </p>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">
                Payment Instructions:
              </h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Scan the QR code above with your payment app</li>
                <li>
                  2. Verify the amount: <strong>${pkg.price}</strong>
                </li>
                <li>3. Complete the payment</li>
                <li>4. Upload payment screenshot below</li>
              </ol>
            </div>

            {/* Screenshot Upload Section */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Upload Payment Screenshot
              </h4>

              {!paymentScreenshot && !uploadComplete && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="screenshot-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload payment screenshot
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              )}

              {isUploading && (
                <div className="border border-gray-300 rounded-lg p-4 flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-700">
                    Uploading screenshot...
                  </span>
                </div>
              )}

              {uploadComplete && paymentScreenshot && (
                <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Screenshot uploaded successfully
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-700">
                      {paymentScreenshot.name}
                    </span>
                    <button
                      onClick={() => {
                        setPaymentScreenshot(null);
                        setUploadComplete(false);
                      }}
                      className="text-xs text-green-600 hover:text-green-800 underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {!uploadComplete && (
                <p className="text-xs text-gray-500 mt-2">
                  Upload a clear screenshot showing the payment confirmation
                  with transaction details
                </p>
              )}
            </div>

            {/* Payment Verification Notice */}
            {uploadComplete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Payment Verification
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Your payment will be verified within 5-10 minutes. You'll
                      receive a confirmation email once approved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={!uploadComplete}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all transform ${
                uploadComplete
                  ? `${getColorClasses(
                      pkg.color,
                      "button"
                    )} text-white shadow-lg hover:shadow-xl hover:-translate-y-1`
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => {
                alert(
                  "Payment submitted for verification! You will receive confirmation shortly."
                );
                onClose();
              }}
            >
              {uploadComplete
                ? `Submit Payment - $${pkg.price}`
                : "Upload Payment Screenshot to Continue"}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              By submitting, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Crown className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Choose Your Prime Package
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Packages Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                  pkg.popular
                    ? "border-orange-300 bg-orange-50 transform scale-105"
                    : `${getColorClasses(
                        pkg.color,
                        "border"
                      )} ${getColorClasses(pkg.color, "bg")}`
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <Crown
                    className={`h-8 w-8 mx-auto mb-3 ${getColorClasses(
                      pkg.color,
                      "text"
                    )}`}
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-600">/{pkg.duration}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check
                        className={`h-4 w-4 mt-0.5 ${getColorClasses(
                          pkg.color,
                          "text"
                        )} flex-shrink-0`}
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full ${getColorClasses(
                    pkg.color,
                    "button"
                  )} text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1`}
                >
                  Choose {pkg.name}
                </button>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">
              All plans include a 7-day free trial. Cancel anytime.
            </p>
            <p className="text-xs text-gray-500">
              Prices are in USD and may vary by region. Terms and conditions
              apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimePackagesModal;
