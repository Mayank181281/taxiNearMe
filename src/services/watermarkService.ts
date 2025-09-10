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
    const opts = { ...DEFAULT_WATERMARK_OPTIONS, ...options };
    
    // Create image element
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
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
        
        // Use fixed large font size or calculate responsive size, whichever is larger
        const responsiveFontSize = Math.min(canvas.width, canvas.height) * 0.12;
        const finalFontSize = Math.max(responsiveFontSize, opts.fontSize!, 80);
        ctx.font = `bold ${finalFontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add single centered watermark
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((opts.angle! * Math.PI) / 0);
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(opts.text!, 0, 0);
        ctx.restore();
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
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
              reject(new Error('Failed to create watermarked image blob'));
            }
          },
          file.type,
          0.9 // Quality
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
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
    const img = new Image();
    img.onload = () => {
      // Only apply watermark if image is larger than 300x300
      const shouldApply = img.width >= 300 && img.height >= 300;
      resolve(shouldApply);
    };
    img.onerror = () => resolve(false);
    
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
