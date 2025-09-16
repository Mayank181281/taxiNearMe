/**
 * Watermark Service for adding watermarks to images before upload
 */

interface WatermarkOptions {
  text?: string;
  fontSize?: number;
  opacity?: number;
  position?: 'center' | 'bottom-right' | 'top-left' | 'bottom-left' | 'top-right';
  color?: string;
  angle?: number;
}

const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
  text: 'TAXI NEAR ME',
  fontSize: 80,
  opacity: 0.5,
  position: 'center',
  color: '#ffffff',
  angle: 0
};

/**
 * Add watermark to an image file using HTML5 Canvas
 * @param file - Original image file
 * @param options - Watermark customization options
 * @returns Promise<File> - Watermarked image file
 */
export const addWatermarkToImage = async (
  file: File, 
  options: WatermarkOptions = {}
): Promise<File> => {
  return new Promise((resolve, reject) => {
    console.log('Starting watermark process for file:', file.name, 'Size:', file.size);
    const opts = { ...DEFAULT_WATERMARK_OPTIONS, ...options };
    
    // Create image element
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('Image loaded for watermarking. Dimensions:', img.width, 'x', img.height);
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('Could not get canvas context');
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Configure watermark text
        ctx.globalAlpha = opts.opacity!;
        ctx.fillStyle = opts.color!;
        
        // Calculate responsive font size based on image dimensions
        // Use a percentage of the smaller dimension to ensure it fits
        const minDimension = Math.min(canvas.width, canvas.height);
        const responsiveFontSize = minDimension * 0.25; // 8% of smaller dimension
        
        // Set minimum font size based on image size categories
        let minFontSize = 12; // For very small images
        if (minDimension > 200) minFontSize = 20;
        if (minDimension > 500) minFontSize = 30;
        if (minDimension > 800) minFontSize = 40;
        
        const finalFontSize = Math.max(responsiveFontSize, minFontSize);
        ctx.font = `bold ${Math.floor(finalFontSize)}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Check if text fits within image bounds and adjust if needed
        const textMetrics = ctx.measureText(opts.text!);
        const textWidth = textMetrics.width;
        const maxWidth = canvas.width * 0.9; // Use 90% of image width
        
        if (textWidth > maxWidth) {
          // Reduce font size to fit within bounds
          const scaleFactor = maxWidth / textWidth;
          const adjustedFontSize = Math.floor(finalFontSize * scaleFactor);
          ctx.font = `bold ${adjustedFontSize}px Arial, sans-serif`;
          console.log(`Adjusted font size from ${Math.floor(finalFontSize)} to ${adjustedFontSize} to fit image`);
        }
        
        // Add single centered watermark
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((opts.angle! * Math.PI) / 180);
        
        // Add text shadow for better visibility (proportional to font size)
        const currentFontSize = parseInt(ctx.font.match(/\d+/)?.[0] || '20');
        const shadowBlur = Math.max(2, currentFontSize * 0.1);
        const shadowOffset = Math.max(1, currentFontSize * 0.05);
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowOffset;
        ctx.shadowOffsetY = shadowOffset;
        
        ctx.fillText(opts.text!, 0, 0);
        ctx.restore();
        
        console.log(`Watermark applied: "${opts.text!}" with font size ${currentFontSize}px on ${canvas.width}x${canvas.height} image`);
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('Watermarked blob created successfully. Size:', blob.size);
              // Create new file with watermark
              const watermarkedFile = new File(
                [blob],
                file.name,
                {
                  type: file.type,
                  lastModified: Date.now()
                }
              );
              resolve(watermarkedFile);
            } else {
              console.error('Failed to create watermarked image blob');
              reject(new Error('Failed to create watermarked image blob'));
            }
          },
          file.type,
          0.9 // Quality
        );
      } catch (error) {
        console.error('Error in watermark processing:', error);
        reject(error);
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load image for watermarking');
      reject(new Error('Failed to load image'));
    };
    
    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Check if watermark should be applied based on image dimensions
 * Skip watermark for very small images
 */
export const shouldApplyWatermark = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log('Checking if watermark should be applied to:', file.name);
    const img = new Image();
    img.onload = () => {
      // Only apply watermark if image is larger than 100x100 to ensure readability
      const shouldApply = img.width >= 32 && img.height >= 32;
      console.log(`Image dimensions: ${img.width}x${img.height}, Should apply watermark: ${shouldApply}`);
      resolve(shouldApply);
    };
    img.onerror = () => {
      console.error('Error loading image for size check');
      resolve(false);
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Process multiple images with watermarks
 */
export const addWatermarksToImages = async (
  files: File[], 
  options?: WatermarkOptions
): Promise<File[]> => {
  const watermarkedFiles: File[] = [];
  
  for (const file of files) {
    try {
      const shouldWatermark = await shouldApplyWatermark(file);
      
      if (shouldWatermark) {
        const watermarkedFile = await addWatermarkToImage(file, options);
        watermarkedFiles.push(watermarkedFile);
      } else {
        // Keep original file if too small for watermark
        watermarkedFiles.push(file);
      }
    } catch (error) {
      console.error('Error adding watermark to', file.name, ':', error);
      // If watermarking fails, use original file
      watermarkedFiles.push(file);
    }
  }
  
  return watermarkedFiles;
};
