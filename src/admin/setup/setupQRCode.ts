import { initializeQRCodeData, checkQRCodeExists } from "./initializeQRCode";

// This function can be called once to set up the initial QR code document
export const setupQRCodeDocument = async () => {
  try {
    const exists = await checkQRCodeExists();

    if (!exists) {
      await initializeQRCodeData();
      return {
        success: true,
        message: "QR code document created successfully!",
      };
    } else {
      return {
        success: true,
        message: "QR code document already exists.",
      };
    }
  } catch (error) {
    console.error("Error setting up QR code document:", error);
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
