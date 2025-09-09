import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface ExpiredAdProcessResult {
  processedCount: number;
  downgradedAds: Array<{
    id: string;
    title: string;
    originalTag: string;
    newTag: string;
    expiryDate: Date;
  }>;
  errors: string[];
}

/**
 * Process expired VIP/VIP Prime ads and downgrade them to Free ads
 * This maintains the ads in the database but changes their tier
 */
export const processExpiredAds = async (): Promise<ExpiredAdProcessResult> => {
  try {
    console.log("🔄 Starting expired ads processing...");

    const now = new Date();
    const nowTimestamp = Timestamp.fromDate(now);

    // Query for expired VIP and VIP Prime ads only
    const expiredVipQuery = query(
      collection(db, "adData"),
      where("expiryDate", "<", nowTimestamp),
      where("tag", "in", ["vip", "vip-prime"])
    );

    const expiredSnapshot = await getDocs(expiredVipQuery);

    console.log(
      `📊 Found ${expiredSnapshot.docs.length} expired VIP/VIP Prime ads to process`
    );

    const downgradedAds = [];
    const errors = [];
    let processedCount = 0;

    for (const adDoc of expiredSnapshot.docs) {
      try {
        const adData = adDoc.data();
        const originalTag = adData.tag;

        console.log(
          `⬇️ Downgrading ad: ${adDoc.id} from ${originalTag} to free`
        );

        // Update the ad to Free tier
        await updateDoc(doc(db, "adData", adDoc.id), {
          tag: "free",
          // Keep original expiry date for reference
          originalTag: originalTag, // Store original tier for history
          downgradedAt: Timestamp.now(),
          // Remove the expiry date since Free ads don't expire
          expiryDate: null,
          // Ensure it remains visible
          status: "approved",
          approved: true,
          updatedAt: Timestamp.now(),
        });

        downgradedAds.push({
          id: adDoc.id,
          title: adData.title || "Untitled Ad",
          originalTag,
          newTag: "free",
          expiryDate: adData.expiryDate?.toDate() || new Date(),
        });

        processedCount++;
        console.log(`✅ Successfully downgraded ad: ${adDoc.id}`);
      } catch (error) {
        const errorMsg = `Failed to process ad ${adDoc.id}: ${error}`;
        console.error("❌", errorMsg);
        errors.push(errorMsg);
      }
    }

    console.log(
      `🎉 Processing complete: ${processedCount} ads downgraded, ${errors.length} errors`
    );

    return {
      processedCount,
      downgradedAds,
      errors,
    };
  } catch (error) {
    console.error("❌ Error in processExpiredAds:", error);
    throw error;
  }
};

/**
 * Get all expired ads that need processing (for preview before processing)
 */
export const getExpiredAdsForProcessing = async () => {
  try {
    const now = new Date();
    const nowTimestamp = Timestamp.fromDate(now);

    // Query for expired VIP and VIP Prime ads only
    const expiredVipQuery = query(
      collection(db, "adData"),
      where("expiryDate", "<", nowTimestamp),
      where("tag", "in", ["vip", "vip-prime"])
    );

    const expiredSnapshot = await getDocs(expiredVipQuery);

    return expiredSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Untitled Ad",
        tag: data.tag,
        status: data.status,
        approved: data.approved,
        expiryDate: data.expiryDate?.toDate(),
        userId: data.userId,
      };
    });
  } catch (error) {
    console.error("Error fetching expired ads for processing:", error);
    throw error;
  }
};

/**
 * Check if an ad has been downgraded from a premium tier
 */
export const isDowngradedAd = (adData: Record<string, unknown>): boolean => {
  return !!(adData.originalTag && adData.downgradedAt);
};

/**
 * Get downgrade history for an ad
 */
export const getAdDowngradeInfo = (adData: Record<string, unknown>) => {
  if (!isDowngradedAd(adData)) {
    return null;
  }

  return {
    originalTag: adData.originalTag as string,
    downgradedAt: (adData.downgradedAt as { toDate?: () => Date })?.toDate?.(),
    canUpgrade: true,
  };
};
