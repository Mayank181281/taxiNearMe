import { db } from "../config/firebase";
import {
  doc,
  updateDoc,
  Timestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { Advertisement } from "./advertisementService";

export interface UpgradeOptions {
  tag: "vip" | "vip-prime";
  planDuration: number;
  planUnit: "Day";
}

/**
 * Upgrade a free ad to VIP or VIP Prime
 * This function handles the upgrade process and sets the ad to pending approval
 */
export const upgradeAdvertisement = async (
  adId: string,
  upgradeOptions: UpgradeOptions,
  paymentDetails?: {
    transactionId: string;
    paymentMode: string;
  }
): Promise<void> => {
  try {
    // Calculate new expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + upgradeOptions.planDuration);

    // Update the advertisement with new tier and pending status
    const adRef = doc(db, "adData", adId);

    const updateData: Record<string, unknown> = {
      tag: upgradeOptions.tag,
      planDuration: upgradeOptions.planDuration,
      planUnit: upgradeOptions.planUnit,
      expiryDate: Timestamp.fromDate(expiryDate),
      status: "pending", // Requires admin approval
      approved: false, // Reset approval status
      upgradedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Add payment details if provided
    if (paymentDetails) {
      updateData.transactionId = paymentDetails.transactionId;
      updateData.paymentMode = paymentDetails.paymentMode;
    }

    // Preserve downgrade history for reference
    // Don't remove originalTag or downgradedAt - keep for history

    await updateDoc(adRef, updateData);

    console.log(`✅ Successfully upgraded ad ${adId} to ${upgradeOptions.tag}`);
  } catch (error) {
    console.error("❌ Error upgrading advertisement:", error);
    throw error;
  }
};

/**
 * Check if an ad is eligible for upgrade
 * Only free ads (originally free or downgraded from premium) can be upgraded
 */
export const isAdEligibleForUpgrade = (ad: Advertisement): boolean => {
  return (
    ad.tag === "free" && (ad.status === "approved" || ad.status === "published")
  );
};

/**
 * Check if an ad was previously a premium ad (downgraded)
 */
export const wasAdDowngraded = (ad: Advertisement): boolean => {
  return !!(ad.originalTag && ad.downgradedAt);
};

/**
 * Get upgrade pricing for VIP and VIP Prime plans
 */
export const getUpgradePricing = () => {
  return {
    vip: {
      daily: { price: 100, duration: 1 },
      monthly: { price: 1500, duration: 30 },
    },
    "vip-prime": {
      daily: { price: 200, duration: 1 },
      monthly: { price: 3000, duration: 30 },
    },
  };
};

/**
 * Create upgrade payment record
 */
export const createUpgradePaymentRecord = async (
  adId: string,
  userId: string,
  upgradeOptions: UpgradeOptions,
  amount: number,
  transactionId: string
) => {
  try {
    const paymentRecord = {
      adId,
      userId,
      type: "upgrade",
      plan: upgradeOptions.tag,
      duration: upgradeOptions.planDuration,
      amount,
      transactionId,
      status: "completed",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "payments"), paymentRecord);
    console.log("✅ Upgrade payment record created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating upgrade payment record:", error);
    throw error;
  }
};
