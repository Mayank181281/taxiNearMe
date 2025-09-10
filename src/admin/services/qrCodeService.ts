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

import { uploadToCloudinaryWithoutWatermark } from "../../services/cloudinaryService";

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // Use the non-watermarked version for QR codes
  return uploadToCloudinaryWithoutWatermark(file);
};
