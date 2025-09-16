import React, { useState, useRef } from 'react';
import { addWatermarkToImage, shouldApplyWatermark } from '../services/watermarkService';

interface WatermarkDemoProps {
  className?: string;
}

const WatermarkDemo: React.FC<WatermarkDemoProps> = ({ className = '' }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setWatermarkedImage(null);
    setIsProcessing(true);

    try {
      // Show original image
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Check if watermark should be applied
      const shouldWatermark = await shouldApplyWatermark(file);
      
      if (shouldWatermark) {
        // Apply watermark
        const watermarkedFile = await addWatermarkToImage(file, {
          text: 'TAXI NEAR ME',
          opacity: 0.6,
          position: 'center',
          color: '#ffffff',
          angle: 0
        });

        // Show watermarked image
        const watermarkedReader = new FileReader();
        watermarkedReader.onload = (e) => {
          setWatermarkedImage(e.target?.result as string);
          setIsProcessing(false);
        };
        watermarkedReader.readAsDataURL(watermarkedFile);
      } else {
        alert('Image is too small for watermark demonstration. Please select a larger image (minimum 100x100 pixels).');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
      setIsProcessing(false);
    }
  };

  const resetDemo = () => {
    setOriginalImage(null);
    setWatermarkedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Watermark Demo
        </h3>
        <p className="text-gray-600 text-sm">
          Upload an image to see how the automatic watermark protection works for your advertisements.
        </p>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
            id="watermark-demo-upload"
          />
          <label
            htmlFor="watermark-demo-upload"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors flex items-center gap-2"
          >
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Select Image
          </label>
          
          {(originalImage || watermarkedImage) && (
            <button
              onClick={resetDemo}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Image Comparison */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Original Image</h4>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Watermarked Image */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              With Watermark
              {isProcessing && (
                <span className="ml-2 text-sm text-blue-600">Processing...</span>
              )}
            </h4>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {isProcessing ? (
                <div className="w-full h-64 flex items-center justify-center bg-gray-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : watermarkedImage ? (
                <img
                  src={watermarkedImage}
                  alt="Watermarked"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400">Processing watermark...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!originalImage && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            No image selected
          </h3>
          <p className="text-sm text-gray-500">
            Upload an image to see the watermark functionality in action
          </p>
        </div>
      )}

      {/* Watermark Info */}
      {watermarkedImage && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
            <div>
              <p className="text-sm text-green-700 font-medium">
                Watermark Applied Successfully!
              </p>
              <p className="text-xs text-green-600 mt-1">
                This is exactly how your advertisement images will appear after upload - with subtle "TAXI NEAR ME" watermarks for brand protection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatermarkDemo;
