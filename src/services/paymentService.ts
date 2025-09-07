import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export interface QRCodeData {
  bankName: string;
  upiId: string;
  qrCodeUrl: string;
  lastUpdated: Timestamp | string;
}

// Get QR code data for payment page
export const getPaymentQRCode = async (): Promise<QRCodeData | null> => {
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
