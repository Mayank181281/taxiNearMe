import React, { useState, useRef } from "react";
import { Camera, Upload, X, User, CheckCircle, AlertCircle } from "lucide-react";
import { uploadToCloudinaryWithoutWatermark } from "../services/cloudinaryService";
import { validateFile } from "../utils/validation";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (photoUrl: string | null) => void;
  isUploading?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoUpdate,
  isUploading = false,
  className = "",
  size = "medium"
}) => {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentPhotoUrl changes (e.g., when user data loads)
  React.useEffect(() => {
    setPreview(currentPhotoUrl || null);
  }, [currentPhotoUrl]);

  // Size configurations
  const sizeConfig = {
    small: { container: "w-16 h-16", text: "text-xs", icon: "h-4 w-4" },
    medium: { container: "w-24 h-24", text: "text-sm", icon: "h-5 w-5" },
    large: { container: "w-32 h-32", text: "text-base", icon: "h-6 w-6" }
  };

  const config = sizeConfig[size];

  const handleFileSelect = async (file: File) => {
    setErrorMessage("");
    setUploadStatus('idle');

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid file");
      setUploadStatus('error');
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      setUploadStatus('uploading');
      
      // Check if Cloudinary is configured
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      if (!cloudName || !uploadPreset || 
          cloudName === 'your_cloud_name_here' || 
          uploadPreset === 'your_upload_preset_here') {
        throw new Error('Cloudinary is not configured. Please set up VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.');
      }
      
      // Upload to Cloudinary (without watermark for profile photos)
      const photoUrl = await uploadToCloudinaryWithoutWatermark(file);
      
      setUploadStatus('success');
      onPhotoUpdate(photoUrl);
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      setPreview(photoUrl);

      // Auto-hide success status after 2 seconds
      setTimeout(() => setUploadStatus('idle'), 2000);

    } catch (error) {
      console.error("Error uploading profile photo:", error);
      
      let errorMsg = "Failed to upload photo. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('Cloudinary is not configured')) {
          errorMsg = "Image upload service is not configured. Please contact support.";
        } else if (error.message.includes('Cloudinary upload failed')) {
          errorMsg = "Upload service temporarily unavailable. Please try again later.";
        } else {
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
      setUploadStatus('error');
      
      // Revert preview
      URL.revokeObjectURL(previewUrl);
      setPreview(currentPhotoUrl || null);

      // Auto-hide error after 5 seconds for configuration errors
      setTimeout(() => {
        setUploadStatus('idle');
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
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

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoUpdate(null);
    setUploadStatus('idle');
    setErrorMessage("");
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!isUploading && uploadStatus !== 'uploading') {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Photo Upload Area */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          ${config.container} relative rounded-full border-2 border-dashed border-gray-300 
          cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-gray-100
          ${dragOver ? 'border-blue-500 bg-blue-50' : ''}
          ${isUploading || uploadStatus === 'uploading' ? 'cursor-not-allowed opacity-50' : ''}
          ${uploadStatus === 'success' ? 'border-green-500' : ''}
          ${uploadStatus === 'error' ? 'border-red-500' : ''}
        `}
      >
        {preview ? (
          <>
            {/* Profile Photo Preview */}
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            
            {/* Upload Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Camera className={`${config.icon} text-white`} />
            </div>

            {/* Status Indicators */}
            {uploadStatus === 'success' && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                <AlertCircle className="h-3 w-3 text-white" />
              </div>
            )}

            {/* Remove Button */}
            {!isUploading && uploadStatus !== 'uploading' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            {uploadStatus === 'uploading' ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            ) : (
              <>
                <User className={`${config.icon} mb-1`} />
                <Upload className="h-3 w-3" />
              </>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {(isUploading || uploadStatus === 'uploading') && (
          <div className="absolute inset-0 bg-white bg-opacity-70 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || uploadStatus === 'uploading'}
      />

      {/* Upload Instructions */}
      <div className={`text-center ${config.text}`}>
        <p className="text-gray-600 font-medium">
          {preview ? "Change Photo" : "Add Photo"}
        </p>
        <p className="text-gray-400 text-xs">
          Click or drag & drop
        </p>
        <p className="text-gray-400 text-xs">
          JPG, JPEG, PNG (Max 2MB)
        </p>
      </div>

      {/* Status Messages */}
      {uploadStatus === 'success' && (
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className={config.text}>Photo uploaded successfully!</span>
        </div>
      )}

      {uploadStatus === 'error' && errorMessage && (
        <div className="flex items-start space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span className={`${config.text} leading-tight`}>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
