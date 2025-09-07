import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

export const initializeQRCodeData = async () => {
  try {
    const qrCodeRef = doc(db, "payment", "qrcodeURLid");

    // Sample data - replace with actual values
    const initialData = {
      bankName: "HDFC Bank",
      upiId: "yourupi@okhdfcbank",
      qrCodeUrl: "https://storage.googleapis.com/qr123.png", // Placeholder URL
      lastUpdated: serverTimestamp(),
    };

    await setDoc(qrCodeRef, initialData);
    console.log("QR Code document initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing QR code document:", error);
    throw error;
  }
};

// Function to check if QR code document exists
export const checkQRCodeExists = async () => {
  try {
    const { getDoc } = await import("firebase/firestore");
    const qrCodeRef = doc(db, "payment", "qrcodeURLid");
    const qrCodeSnap = await getDoc(qrCodeRef);
    return qrCodeSnap.exists();
  } catch (error) {
    console.error("Error checking QR code document:", error);
    return false;
  }
};
