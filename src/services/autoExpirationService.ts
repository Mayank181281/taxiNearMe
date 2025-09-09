import {
  collection,
  getDocs,
  doc,
  Timestamp,
  writeBatch,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";

let isProcessingExpired = false;
let lastProcessTime = 0;
let processingTimeout: ReturnType<typeof setTimeout> | null = null;
const PROCESS_COOLDOWN = 5000; // 5 seconds cooldown for testing
const PROCESSING_TIMEOUT = 30000; // 30 seconds max processing time

export interface AutoExpirationResult {
  processedCount: number;
  downgradedAds: Array<{
    id: string;
    title: string;
    originalTag: string;
    expiryDate: Date;
  }>;
  skippedCount: number;
}

/**
 * Automatically process expired VIP/VIP Prime ads and downgrade them to Free
 */
export const autoProcessExpiredAds =
  async (): Promise<AutoExpirationResult> => {
    // Check if processing is stuck and force reset if needed
    if (isProcessingExpired) {
      const timeSinceLastProcess = Date.now() - lastProcessTime;
      if (timeSinceLastProcess > PROCESSING_TIMEOUT) {
        isProcessingExpired = false;
        if (processingTimeout) {
          clearTimeout(processingTimeout);
          processingTimeout = null;
        }
      } else {
        return { processedCount: 0, downgradedAds: [], skippedCount: 0 };
      }
    }

    const now = Date.now();
    if (now - lastProcessTime < PROCESS_COOLDOWN) {
      return { processedCount: 0, downgradedAds: [], skippedCount: 0 };
    }

    isProcessingExpired = true;
    lastProcessTime = now;

    // Set timeout to prevent getting stuck
    processingTimeout = setTimeout(() => {
      isProcessingExpired = false;
    }, PROCESSING_TIMEOUT);

    try {
      const currentTime = new Date();

      // Get ALL ads to avoid complex queries
      const allAdsSnapshot = await getDocs(collection(db, "adData"));

      const expiredAds: Array<{
        doc: QueryDocumentSnapshot<DocumentData>;
        data: DocumentData;
        expiryDate: Date;
      }> = [];

      // Check each ad manually
      allAdsSnapshot.docs.forEach((adDoc) => {
        const adData = adDoc.data();

        // Only process VIP and VIP Prime ads
        if (adData.tag !== "vip" && adData.tag !== "vip-prime") {
          return;
        }

        let expiryDate: Date | null = null;

        if (adData.expiryDate) {
          if (adData.expiryDate.toDate) {
            expiryDate = adData.expiryDate.toDate();
          } else if (adData.expiryDate instanceof Date) {
            expiryDate = adData.expiryDate;
          } else if (typeof adData.expiryDate === "string") {
            expiryDate = new Date(adData.expiryDate);
          }
        }

        if (expiryDate && expiryDate <= currentTime) {
          expiredAds.push({ doc: adDoc, data: adData, expiryDate });
        }
      });

      if (expiredAds.length === 0) {
        return { processedCount: 0, downgradedAds: [], skippedCount: 0 };
      }

      const batch = writeBatch(db);
      const downgradedAds: Array<{
        id: string;
        title: string;
        originalTag: string;
        expiryDate: Date;
      }> = [];
      let processedCount = 0;

      expiredAds.forEach(({ doc: adDoc, data: adData, expiryDate }) => {
        try {
          const originalTag = adData.tag;

          const adRef = doc(db, "adData", adDoc.id);
          batch.update(adRef, {
            tag: "free",
            originalTag: originalTag,
            downgradedAt: Timestamp.fromDate(currentTime),
            autoDowngraded: true,
            expiryDate: null,
            status: "approved",
            approved: true,
            updatedAt: Timestamp.fromDate(currentTime),
          });

          downgradedAds.push({
            id: adDoc.id,
            title: adData.title || "Untitled Ad",
            originalTag,
            expiryDate: expiryDate,
          });

          processedCount++;
        } catch (error) {
          console.error(`Error processing ad ${adDoc.id}:`, error);
        }
      });

      if (processedCount > 0) {
        await batch.commit();
      }

      return {
        processedCount,
        downgradedAds,
        skippedCount: expiredAds.length - processedCount,
      };
    } catch (error) {
      console.error("Error in expiration processing:", error);
      return { processedCount: 0, downgradedAds: [], skippedCount: 0 };
    } finally {
      isProcessingExpired = false;
      if (processingTimeout) {
        clearTimeout(processingTimeout);
        processingTimeout = null;
      }
    }
  };

export const checkAndProcessExpiredAds = async (): Promise<void> => {
  try {
    await autoProcessExpiredAds();
  } catch (error) {
    console.error("Error in expiration check:", error);
  }
};

export const initializeAutoExpiration = () => {
  setTimeout(() => {
    checkAndProcessExpiredAds();
  }, 5000);

  setInterval(() => {
    checkAndProcessExpiredAds();
  }, 5 * 60 * 1000);
};

export const triggerImmediateExpiration =
  async (): Promise<AutoExpirationResult> => {
    // Force reset everything
    isProcessingExpired = false;
    lastProcessTime = 0;
    if (processingTimeout) {
      clearTimeout(processingTimeout);
      processingTimeout = null;
    }

    return await autoProcessExpiredAds();
  };

/**
 * Global reset function for debugging
 */
export const resetExpirationSystem = () => {
  isProcessingExpired = false;
  lastProcessTime = 0;
  if (processingTimeout) {
    clearTimeout(processingTimeout);
    processingTimeout = null;
  }
};

// Make reset function available globally for debugging
if (typeof window !== "undefined") {
  (
    window as {
      resetExpirationSystem?: typeof resetExpirationSystem;
      triggerExpiration?: typeof triggerImmediateExpiration;
    }
  ).resetExpirationSystem = resetExpirationSystem;
  (
    window as {
      resetExpirationSystem?: typeof resetExpirationSystem;
      triggerExpiration?: typeof triggerImmediateExpiration;
    }
  ).triggerExpiration = triggerImmediateExpiration;
}
