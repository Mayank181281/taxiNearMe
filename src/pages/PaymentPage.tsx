import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Get plan details from URL parameters
  const planType = searchParams.get("plan") || "vip";
  const billingPeriod = searchParams.get("period") || "month";
  const price = searchParams.get("price") || "40";

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleVerify = () => {
    if (uploadedFile) {
      // Here you would typically upload the file to your server
      // For now, we'll just navigate back to the adverts page
      alert(
        "Payment screenshot uploaded successfully! Your ad will be reviewed and activated soon."
      );
      navigate("/profile/your-adverts");
    } else {
      alert("Please upload a payment screenshot first.");
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
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

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upload your payment screenshot.
        </h3>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : uploadedFile
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload"
          />

          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Payment screenshot"
                  className="max-w-64 max-h-64 object-contain rounded-lg border"
                />
              </div>
              <p className="text-green-600 font-medium">{uploadedFile.name}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg
                  className="w-12 h-12 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 font-medium hover:text-blue-700">
                    Upload Or Drag
                  </span>
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            </div>
          )}
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
