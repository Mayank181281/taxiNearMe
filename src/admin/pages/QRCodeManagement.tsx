import React, { useState, useEffect } from "react";
import {
  getQRCodeData,
  updateQRCodeData,
  uploadImageToCloudinary,
  QRCodeData,
} from "../services/qrCodeService";
import { setupQRCodeDocument } from "../setup/setupQRCode";

const QRCodeManagement: React.FC = () => {
  const [currentData, setCurrentData] = useState<QRCodeData | null>(null);
  const [formData, setFormData] = useState({
    bankName: "",
    upiId: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load current QR code data on component mount
  useEffect(() => {
    loadQRCodeData();
  }, []);

  const loadQRCodeData = async () => {
    try {
      setLoading(true);
      const data = await getQRCodeData();
      if (data) {
        setCurrentData(data);
        setFormData({
          bankName: data.bankName,
          upiId: data.upiId,
        });
        setPreviewUrl(data.qrCodeUrl);
      }
    } catch (error) {
      console.error("Error loading QR code data:", error);
      setMessage({
        type: "error",
        text: "Failed to load current QR code data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({
          type: "error",
          text: "Please select a valid image file",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "File size should be less than 5MB",
        });
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setMessage(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.bankName.trim() || !formData.upiId.trim()) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      });
      return;
    }

    try {
      setUpdating(true);
      setMessage(null);

      let qrCodeUrl = currentData?.qrCodeUrl || "";

      // If a new file is selected, upload it to Cloudinary
      if (selectedFile) {
        console.log("Uploading new image to Cloudinary...");
        qrCodeUrl = await uploadImageToCloudinary(selectedFile);
        console.log("Image uploaded successfully:", qrCodeUrl);
      }

      // Update Firestore document
      const updateData = {
        bankName: formData.bankName.trim(),
        upiId: formData.upiId.trim(),
        qrCodeUrl,
      };

      await updateQRCodeData(updateData);

      // Reload data to get updated timestamp
      await loadQRCodeData();

      setMessage({
        type: "success",
        text: "QR code updated successfully!",
      });

      // Clear selected file
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating QR code:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update QR code",
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatLastUpdated = (
    timestamp: string | Date | { toDate: () => Date } | null | undefined
  ) => {
    if (!timestamp) return "Never";

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
        return "Unknown";
      }

      return date.toLocaleString();
    } catch {
      return "Unknown";
    }
  };

  const handleInitialize = async () => {
    try {
      setInitializing(true);
      setMessage(null);

      const result = await setupQRCodeDocument();

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
        });
        // Reload data after initialization
        await loadQRCodeData();
      } else {
        setMessage({
          type: "error",
          text: result.message,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to initialize QR code document",
      });
    } finally {
      setInitializing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              QR Code Management
            </h2>
            <p className="text-gray-600">
              Upload and manage the payment QR code for all users. Changes will
              be reflected immediately across the application.
            </p>
          </div>
          {!currentData && (
            <button
              onClick={handleInitialize}
              disabled={initializing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {initializing ? "Initializing..." : "Initialize QR Code"}
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Current QR Code Info */}
      {currentData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Current QR Code Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <p className="text-gray-900">{currentData.bankName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <p className="text-gray-900">{currentData.upiId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-600">
                  {formatLastUpdated(currentData.lastUpdated)}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              {currentData.qrCodeUrl && (
                <div className="max-w-xs">
                  <img
                    src={currentData.qrCodeUrl}
                    alt="Current QR Code"
                    className="w-full h-auto border border-gray-200 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Update QR Code
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter bank name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID *
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter UPI ID (e.g., yourname@bank)"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or GIF (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            {selectedFile && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Preview */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="flex justify-center">
                <div className="max-w-xs">
                  <img
                    src={previewUrl}
                    alt="QR Code Preview"
                    className="w-full h-auto border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updating ? "Updating..." : "Update QR Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QRCodeManagement;
