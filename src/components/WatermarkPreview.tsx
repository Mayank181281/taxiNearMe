import React, { useState, useEffect } from 'react';

interface WatermarkPreviewProps {
  imageUrl?: string;
  className?: string;
}

const WatermarkPreview: React.FC<WatermarkPreviewProps> = ({ 
  imageUrl = '/images/taxi-logo.png',
  className = ''
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  useEffect(() => {
    // Create a preview of what the watermark looks like
    const createPreview = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 300;
        
        // Draw a sample background (gradient)
        const gradient = ctx?.createLinearGradient(0, 0, 400, 300);
        gradient?.addColorStop(0, '#3B82F6');
        gradient?.addColorStop(1, '#1E40AF');
        
        if (ctx && gradient) {
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 400, 300);
          
          // Add single centered watermark
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = '#ffffff';
          
          // Use larger font size
          const fontSize = Math.max(Math.min(canvas.width, canvas.height) * 0.12, 80);
          ctx.font = `bold ${fontSize}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Add text shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          // Draw single watermark in center (horizontal)
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((0 * Math.PI) / 180);
          ctx.fillText('TAXI NEAR ME', 0, 0);
          ctx.restore();
          
          // Convert to image
          setPreviewImage(canvas.toDataURL());
        }
      };
      
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      
      // Fallback: create without image
      img.onerror = () => {
        canvas.width = 400;
        canvas.height = 300;
        
        const gradient = ctx?.createLinearGradient(0, 0, 400, 300);
        gradient?.addColorStop(0, '#3B82F6');
        gradient?.addColorStop(1, '#1E40AF');
        
        if (ctx && gradient) {
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 400, 300);
          
          // Add single centered watermark
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = '#ffffff';
          
          // Use larger font size
          const fontSize = Math.max(Math.min(canvas.width, canvas.height) * 0.12, 80);
          ctx.font = `bold ${fontSize}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Add text shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          // Draw single watermark in center (horizontal)
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((0 * Math.PI) / 180);
          ctx.fillText('TAXI NEAR ME', 0, 0);
          ctx.restore();
          
          setPreviewImage(canvas.toDataURL());
        }
      };
    };
    
    createPreview();
  }, [imageUrl]);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Watermark Preview
        </h3>
        <p className="text-gray-600 text-sm">
          This shows how the "TAXI NEAR ME" watermark appears on uploaded images.
        </p>
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Watermark Preview"
            className="w-full h-auto"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
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
          Subtle and non-intrusive design
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
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
          Maintains image quality
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
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
          Applied automatically to all uploads
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
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
          Brand protection and authenticity
        </div>
      </div>
    </div>
  );
};

export default WatermarkPreview;
