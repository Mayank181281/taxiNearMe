import { Timestamp } from "firebase/firestore";

/**
 * Client-side filtering utilities for expired ads
 */

export interface Advertisement {
  id: string;
  title: string;
  tag: string;
  status: string;
  approved: boolean;
  expiryDate?: Date | Timestamp;
  originalTag?: string;
  downgradedAt?: Date | Timestamp;
  [key: string]: unknown;
}

/**
 * Check if an ad is expired but not yet processed
 */
export const isExpiredButNotProcessed = (ad: Advertisement): boolean => {
  if (!ad.expiryDate) return false;

  const expiryDate =
    ad.expiryDate instanceof Date
      ? ad.expiryDate
      : (ad.expiryDate as Timestamp).toDate();

  const now = new Date();
  const isExpired = expiryDate < now;

  // If expired and still has premium tag (not downgraded yet)
  return (
    isExpired &&
    (ad.tag === "vip" || ad.tag === "vip-prime") &&
    !ad.downgradedAt
  );
};

/**
 * Filter out expired ads that haven't been processed yet
 * This ensures users don't see expired premium ads in search results
 */
export const filterActiveAds = (ads: Advertisement[]): Advertisement[] => {
  return ads.filter((ad) => {
    // Always show free ads (they don't expire)
    if (ad.tag === "free") return true;

    // Show VIP/VIP Prime ads only if not expired or already processed
    if (ad.tag === "vip" || ad.tag === "vip-prime") {
      return !isExpiredButNotProcessed(ad);
    }

    return true;
  });
};

/**
 * Get the effective tier of an ad (accounting for expiration)
 * This helps display the correct tier in UI before admin processing
 */
export const getEffectiveTier = (ad: Advertisement): string => {
  if (isExpiredButNotProcessed(ad)) {
    return "free"; // Should be displayed as free even though DB still shows vip/vip-prime
  }
  return ad.tag || "free";
};

/**
 * Check if an ad was downgraded from a premium tier
 */
export const wasDowngraded = (ad: Advertisement): boolean => {
  return !!(ad.originalTag && ad.downgradedAt);
};

/**
 * Get upgrade options for a free ad
 */
export const getUpgradeOptions = () => {
  return [
    {
      tier: "vip",
      name: "VIP",
      description: "Priority placement and highlighting",
      canUpgrade: true,
    },
    {
      tier: "vip-prime",
      name: "VIP Prime",
      description: "Maximum visibility and top placement",
      canUpgrade: true,
    },
  ];
};

/**
 * Sort ads by effective priority (considering expiration)
 * VIP Prime (active) > VIP (active) > Free > Expired Premium
 */
export const sortAdsByPriority = (ads: Advertisement[]): Advertisement[] => {
  return ads.sort((a, b) => {
    const aTier = getEffectiveTier(a);
    const bTier = getEffectiveTier(b);

    const tierPriority = {
      "vip-prime": 3,
      vip: 2,
      free: 1,
    };

    const aPriority = tierPriority[aTier as keyof typeof tierPriority] || 0;
    const bPriority = tierPriority[bTier as keyof typeof tierPriority] || 0;

    return bPriority - aPriority;
  });
};
