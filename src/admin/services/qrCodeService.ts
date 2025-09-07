import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export interface QRCodeData {
  bankName: string;
  upiId: string;
  qrCodeUrl: string;
  lastUpdated: Timestamp | string;
}

export interface QRCodeUpdateData {
  bankName: string;
  upiId: string;
  qrCodeUrl: string;
}

// Get current QR code data
export const getQRCodeData = async (): Promise<QRCodeData | null> => {
  try {
    const qrCodeRef = doc(db, "payment", "qrcodeURLid");
    const qrCodeSnap = await getDoc(qrCodeRef);

    if (qrCodeSnap.exists()) {
      return qrCodeSnap.data() as QRCodeData;
    } else {
      console.log("No QR code document found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching QR code data:", error);
    throw error;
  }
};

// Update QR code data
export const updateQRCodeData = async (
  data: QRCodeUpdateData
): Promise<void> => {
  try {
    const qrCodeRef = doc(db, "payment", "qrcodeURLid");

    await updateDoc(qrCodeRef, {
      ...data,
      lastUpdated: serverTimestamp(),
    });

    console.log("QR code data updated successfully");
  } catch (error) {
    console.error("Error updating QR code data:", error);
    throw error;
  }
};

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "taxinearme"
  );
  formData.append("folder", "taxi-app/qr-codes");

  // Get Cloudinary cloud name from environment variables
  const CLOUDINARY_CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dplkknhin";

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to upload image to Cloudinary: ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
