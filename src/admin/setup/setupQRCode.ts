import { initializeQRCodeData, checkQRCodeExists } from "./initializeQRCode";

// This function can be called once to set up the initial QR code document
export const setupQRCodeDocument = async () => {
  try {
    console.log("Checking if QR code document exists...");
    const exists = await checkQRCodeExists();

    if (!exists) {
      console.log(
        "QR code document doesn't exist. Creating initial document..."
      );
      await initializeQRCodeData();
      console.log("✅ QR code document created successfully!");
      return {
        success: true,
        message: "QR code document created successfully!",
      };
    } else {
      console.log("QR code document already exists.");
      return {
        success: true,
        message: "QR code document already exists.",
      };
    }
  } catch (error) {
    console.error("❌ Error setting up QR code document:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Auto-run the setup when this module is imported (optional)
// You can remove this if you prefer to call setupQRCodeDocument manually
if (typeof window !== "undefined") {
  // Only run in browser environment, not during SSR
  setupQRCodeDocument();
}
