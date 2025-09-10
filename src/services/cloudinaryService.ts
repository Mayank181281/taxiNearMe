import { addWatermarkToImage, shouldApplyWatermark } from './watermarkService';

// Function to upload image to Cloudinary with automatic watermarking
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your .env file.');
  }

  try {
    let fileToUpload = file;
    
    // Apply watermark if the image is large enough
    try {
      const shouldWatermark = await shouldApplyWatermark(file);
      if (shouldWatermark) {
        console.log('Applying watermark to image:', file.name);
        fileToUpload = await addWatermarkToImage(file, {
          text: 'TAXI NEAR ME',
          fontSize: Math.min(file.size / 50000, 48), // Dynamic font size based on file size
          opacity: 0.25,
          position: 'center',
          color: '#ffffff',
          angle: -30
        });
        console.log('Watermark applied successfully');
      } else {
        console.log('Image too small for watermark, uploading original');
      }
    } catch (watermarkError) {
      console.warn('Watermark failed, uploading original image:', watermarkError);
      // Continue with original file if watermarking fails
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name', cloudName);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Function to upload image without watermark (for specific cases like QR codes)
export const uploadToCloudinaryWithoutWatermark = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your .env file.');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name', cloudName);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
